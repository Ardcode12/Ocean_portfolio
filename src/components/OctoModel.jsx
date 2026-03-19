import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ OCTO MODEL SETTINGS                                        ║
// ╚═══════════════════════════════════════════════════════════════╝
const OCTO_SETTINGS = {
    // ══════════════════════════════════════════════════════════════
    // SIZE & POSITION
    // ══════════════════════════════════════════════════════════════
    modelScale: 1.5,              // 1.5 = tiny, 2.0 = small, 2.5 = medium, 3.0 = large
    offsetX: 0,                   // Move left (-) or right (+)
    offsetY: 0,                   // Move up (+) or down (-)
    cameraDistance: 3.5,          // Higher = model looks smaller
    cameraY: 0.3,                 // Camera height

    // ══════════════════════════════════════════════════════════════
    // DIRECTION / FACING
    // ══════════════════════════════════════════════════════════════
    facingDirection: 0,     // Math.PI = front, 0 = back
    // Math.PI/2 = left, -Math.PI/2 = right

    // ══════════════════════════════════════════════════════════════
    // IDLE MOTION (subtle floating/swaying)
    // ══════════════════════════════════════════════════════════════
    enableIdleFloat: false,        // Bob up/down
    idleFloatSpeed: 0.8,
    idleFloatAmount: 0.0008,

    enableIdleRotation: false,     // Sway left/right
    idleRotationSpeed: 0.3,
    idleRotationAmount: 0.1,

    // ══════════════════════════════════════════════════════════════
    // ★ ANIMATION SETTINGS
    // ══════════════════════════════════════════════════════════════
    animation: {
        enabled: true,            // Master switch for GLB animations

        // ── MODE ──
        // 'single'   = play one animation on loop
        // 'sequence' = play animations in order, then loop
        // 'random'   = pick random animation after each finishes
        mode: 'sequence',

        // ── SINGLE MODE ──
        // Which animation to play (0-17 for your 18 animations)
        singleIndex: 0,

        // ── SEQUENCE MODE ──
        // List of animation indices to play in order
        // Example: [0, 1, 2] plays animation 0, then 1, then 2, then loops
        // Example: [0, 5, 3, 5] plays 0 → 5 → 3 → 5 → loop
        // Use 'all' to play all animations in order (0 through 17)
        sequence: [1,],   // ★ Change this array!
        // sequence: 'all',       // ★ Or use 'all' for all 18 animations

        // ── TIMING ──
        speed: 0.6,               // Animation playback speed (0.3 = slow, 1.0 = normal)

        // How to handle animation duration in sequence/random mode:
        // 'loop'     = let each animation loop X times before switching
        // 'duration' = play each animation for X seconds before switching
        // 'full'     = play each animation once fully, then switch
        sequenceTiming: 'full',

        loopsPerAnimation: 1,     // For 'loop' timing: how many loops before switch
        durationPerAnimation: 5,  // For 'duration' timing: seconds before switch

        // ── TRANSITIONS ──
        crossfadeDuration: 0.5,   // Seconds to blend between animations (0 = instant)

        // ── ANIMATION DELAYS ──
        // Delay (in seconds) before playing specific animation indices
        delays: {
            1: 0,     // Animation 1: no delay
            2: 1,     // Animation 2: 1 second delay
        },

        // ── LOOP GAPS ──
        delayBetweenLoops: 3,     // 5 second gap between animation loops

        // ── DEBUG ──
        logAnimations: true,      // Log animation names to console on load
    },
};

// ╔═══════════════════════════════════════════════════════════════╗
// ║  COMPONENT                                                     ║
// ╚═══════════════════════════════════════════════════════════════╝
function OctoModel({ size = 680 }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = size;
        const height = size;
        const S = OCTO_SETTINGS;
        const A = S.animation;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, S.cameraY, S.cameraDistance);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lights
        scene.add(new THREE.AmbientLight(0x88ccff, 2.0));
        const key = new THREE.DirectionalLight(0xffffff, 2.0);
        key.position.set(3, 5, 5);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0x66aacc, 1.0);
        fill.position.set(-3, 2, 4);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(0x00e5ff, 0.6);
        rim.position.set(0, -2, -3);
        scene.add(rim);

        // State
        let mixer = null;
        let model = null;
        let baseY = 0;
        let animations = [];
        let currentAction = null;
        let sequenceIndex = 0;
        let loopCount = 0;
        let sequenceList = [];
        let animationStartTime = 0;

        const clock = new THREE.Clock();
        let animFrameId;

        // ── Roar Audio (plays for ALL animations when component is visible) ──
        const roarAudio = new Audio('/sounds/roar.mp3');
        roarAudio.volume = 0.08;
        roarAudio.loop = false;
        let isComponentVisible = false;

        // IntersectionObserver: track when OctoModel is visible
        const visibilityObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isComponentVisible = entry.isIntersecting;
                });
            },
            { threshold: 0.1 }
        );
        visibilityObserver.observe(container);

        // ══════════════════════════════════════════════════════════════
        // ANIMATION FUNCTIONS
        // ══════════════════════════════════════════════════════════════

        function playAnimation(index) {
            if (!mixer || !animations[index]) {
                console.warn(`⚠️ Animation ${index} not found`);
                return;
            }

            const clip = animations[index];
            const newAction = mixer.clipAction(clip);

            if (currentAction && currentAction !== newAction) {
                // Crossfade from current to new
                currentAction.fadeOut(A.crossfadeDuration);
                newAction.reset();
                newAction.fadeIn(A.crossfadeDuration);
            } else {
                newAction.reset();
            }

            newAction.timeScale = A.speed;

            // Get delay for this animation (default to 0)
            const animationDelay = A.delays?.[index] ?? 0;

            // Helper function to start animation and roar simultaneously
            const startAnimationAndRoar = () => {
                newAction.play();
                currentAction = newAction;
                loopCount = 0;
                animationStartTime = clock.getElapsedTime();

                // Play roar sound for EVERY animation start, if component is visible
                if (isComponentVisible) {
                    roarAudio.currentTime = 0;
                    roarAudio.play().catch(() => null);
                    console.log('🔊 Roar played (synchronized with animation start)');
                }

                console.log(`🎬 Playing animation [${index}]: "${clip.name}" (duration: ${clip.duration.toFixed(2)}s)`);
            };

            if (animationDelay > 0) {
                // If there's a delay, wait before playing both animation and roar
                console.log(`⏳ Scheduled animation [${index}]: "${clip.name}" with ${animationDelay}s delay`);
                setTimeout(startAnimationAndRoar, animationDelay * 1000);
            } else {
                // Play immediately if no delay
                startAnimationAndRoar();
            }
        }

        function playNextInSequence() {
            if (sequenceList.length === 0) return;

            sequenceIndex = (sequenceIndex + 1) % sequenceList.length;
            playAnimation(sequenceList[sequenceIndex]);
        }

        function playRandomAnimation() {
            if (animations.length === 0) return;

            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * animations.length);
            } while (animations.length > 1 && animations[randomIndex] === currentAction?.getClip());

            playAnimation(randomIndex);
        }

        function onAnimationLoop() {
            loopCount++;

            if (A.mode === 'sequence' && A.sequenceTiming === 'loop') {
                if (loopCount >= A.loopsPerAnimation) {
                    playNextInSequence();
                }
            } else if (A.mode === 'random' && A.sequenceTiming === 'loop') {
                if (loopCount >= A.loopsPerAnimation) {
                    playRandomAnimation();
                }
            }
        }

        function onAnimationFinished() {
            if (A.mode === 'sequence' && A.sequenceTiming === 'full') {
                // Add delay between loops
                if (A.delayBetweenLoops > 0) {
                    setTimeout(() => {
                        playNextInSequence();
                    }, A.delayBetweenLoops * 1000);
                } else {
                    playNextInSequence();
                }
            } else if (A.mode === 'random' && A.sequenceTiming === 'full') {
                // Add delay between loops
                if (A.delayBetweenLoops > 0) {
                    setTimeout(() => {
                        playRandomAnimation();
                    }, A.delayBetweenLoops * 1000);
                } else {
                    playRandomAnimation();
                }
            }
        }

        function checkDurationSwitch() {
            if (A.sequenceTiming !== 'duration') return;

            const elapsed = clock.getElapsedTime() - animationStartTime;

            if (elapsed >= A.durationPerAnimation) {
                if (A.mode === 'sequence') {
                    playNextInSequence();
                } else if (A.mode === 'random') {
                    playRandomAnimation();
                }
            }
        }

        // ══════════════════════════════════════════════════════════════
        // LOAD MODEL
        // ══════════════════════════════════════════════════════════════

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            '/glb_files/octo.glb',
            (gltf) => {
                model = gltf.scene;

                // Size & position
                const box = new THREE.Box3().setFromObject(model);
                const dims = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const maxDim = Math.max(dims.x, dims.y, dims.z);
                const scale = S.modelScale / maxDim;
                model.scale.setScalar(scale);

                baseY = -center.y * scale + S.offsetY;
                model.position.set(
                    -center.x * scale + S.offsetX,
                    baseY,
                    -center.z * scale
                );

                model.rotation.y = S.facingDirection;

                // Materials
                model.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.envMapIntensity = 1.5;
                        if (child.material.emissive) {
                            child.material.emissive.set(0x224466);
                            child.material.emissiveIntensity = 0.15;
                        }
                        child.material.needsUpdate = true;
                    }
                });

                scene.add(model);

                // ── Setup animations ──
                animations = gltf.animations;

                if (A.logAnimations) {
                    console.log(`🐙 Octo loaded with ${animations.length} animations:`);
                    animations.forEach((clip, i) => {
                        console.log(`   [${i}] "${clip.name}" — ${clip.duration.toFixed(2)}s`);
                    });
                }

                if (A.enabled && animations.length > 0) {
                    mixer = new THREE.AnimationMixer(model);
                    mixer.addEventListener('loop', onAnimationLoop);
                    mixer.addEventListener('finished', onAnimationFinished);

                    // Build sequence list
                    if (A.mode === 'sequence') {
                        if (A.sequence === 'all') {
                            sequenceList = animations.map((_, i) => i);
                        } else {
                            sequenceList = A.sequence.filter(i => i >= 0 && i < animations.length);
                        }
                        console.log(`📋 Sequence: [${sequenceList.join(', ')}]`);
                    }

                    // Set loop mode based on timing
                    if (A.sequenceTiming === 'full') {
                        // For 'full' timing, play once then trigger finished
                        animations.forEach(clip => {
                            const action = mixer.clipAction(clip);
                            action.setLoop(THREE.LoopOnce);
                            action.clampWhenFinished = true;
                        });
                    }

                    // Start first animation
                    if (A.mode === 'single') {
                        playAnimation(A.singleIndex);
                    } else if (A.mode === 'sequence') {
                        sequenceIndex = 0;
                        playAnimation(sequenceList[0]);
                    } else if (A.mode === 'random') {
                        playRandomAnimation();
                    }
                }
            },
            undefined,
            (err) => console.error('❌ Octo load error:', err)
        );

        // ══════════════════════════════════════════════════════════════
        // ANIMATION LOOP
        // ══════════════════════════════════════════════════════════════

        function animate() {
            animFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            // Update mixer
            if (mixer) {
                mixer.update(delta);
                checkDurationSwitch();
            }

            // Idle motions
            if (model) {
                if (S.enableIdleFloat) {
                    model.position.y = baseY + Math.sin(elapsed * S.idleFloatSpeed) * S.idleFloatAmount * 100;
                }
                if (S.enableIdleRotation) {
                    model.rotation.y = S.facingDirection + Math.sin(elapsed * S.idleRotationSpeed) * S.idleRotationAmount;
                }
            }

            renderer.render(scene, camera);
        }
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animFrameId);
            roarAudio.pause();
            roarAudio.currentTime = 0;
            visibilityObserver.disconnect();
            if (mixer) {
                mixer.removeEventListener('loop', onAnimationLoop);
                mixer.removeEventListener('finished', onAnimationFinished);
            }
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [size]);

    return (
        <div
            ref={containerRef}
            className="octo-model-container"
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
        />
    );
}

export default OctoModel;