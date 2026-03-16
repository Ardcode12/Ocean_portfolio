import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ CHRIST MODEL SETTINGS — Edit these to control the model   ║
// ╚═══════════════════════════════════════════════════════════════╝
const CHRIST_SETTINGS = {
    // ══════════════════════════════════════════════════════════════
    // SIZE & POSITION
    // ══════════════════════════════════════════════════════════════
    modelScale: 1.5,
    offsetX: 0,
    offsetY: -0.5,
    cameraDistance: 3,
    cameraY: 0,

    // ══════════════════════════════════════════════════════════════
    // DIRECTION / FACING
    // ══════════════════════════════════════════════════════════════
    facingDirection: 0,

    // ══════════════════════════════════════════════════════════════
    // MOUSE TRACKING
    // ══════════════════════════════════════════════════════════════
    mouseTracking: {
        enabled: true,
        // How much the model rotates towards the mouse (radians)
        maxRotationX: 0.3,   // Up/down tilt
        maxRotationY: 0.6,   // Left/right turn
        smoothness: 0.05,    // Lower = smoother/slower follow (0.01 - 0.2)
    },

    // ══════════════════════════════════════════════════════════════
    // IDLE MOTION (subtle floating/swaying)
    // ══════════════════════════════════════════════════════════════
    enableIdleFloat: true,
    idleFloatSpeed: 0.8,
    idleFloatAmount: 0.03,

    // ══════════════════════════════════════════════════════════════
    // ★ ANIMATION SETTINGS
    // ══════════════════════════════════════════════════════════════
    animation: {
        enabled: true,
        mode: 'single',
        singleIndex: 0,
        speed: 1.0,
        logAnimations: true,
    },
};

// ╔═══════════════════════════════════════════════════════════════╗
// ║  COMPONENT                                                     ║
// ╚═══════════════════════════════════════════════════════════════╝
function ChristModel() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 600;
        const S = CHRIST_SETTINGS;
        const A = S.animation;
        const MT = S.mouseTracking;

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
        scene.add(new THREE.AmbientLight(0x88ccff, 1.5));
        const key = new THREE.DirectionalLight(0xffffff, 2.5);
        key.position.set(3, 5, 5);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0x66aacc, 1.0);
        fill.position.set(-3, 2, 4);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(0x00e5ff, 1.0);
        rim.position.set(0, -2, -3);
        scene.add(rim);

        // State
        let mixer = null;
        let model = null;
        let baseY = 0;

        const clock = new THREE.Clock();
        let animFrameId;

        // ── MOUSE TRACKING STATE ──
        const mouse = { x: 0, y: 0 };        // Normalized mouse (-1 to 1)
        const targetRotation = { x: 0, y: 0 }; // Target rotation
        const currentRotation = { x: 0, y: 0 }; // Smoothed current rotation

        const handleMouseMove = (e) => {
            // Normalize mouse position to -1 to 1 across the entire page
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        if (MT.enabled) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        // ══════════════════════════════════════════════════════════════
        // LOAD MODEL
        // ══════════════════════════════════════════════════════════════

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            '/glb_files/nanando_diver_-_underwater.glb',
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
                        child.material.envMapIntensity = 1.0;
                        if (child.material.emissive) {
                            child.material.emissive.set(0x113355);
                            child.material.emissiveIntensity = 0.2;
                        }
                        child.material.needsUpdate = true;
                    }
                });

                scene.add(model);

                // ── Setup animations ──
                const animations = gltf.animations;

                if (A.logAnimations) {
                    console.log(`✝️ Christ Model loaded with ${animations.length} animations:`);
                    animations.forEach((clip, i) => {
                        console.log(`   [${i}] "${clip.name}" — ${clip.duration.toFixed(2)}s`);
                    });
                }

                if (A.enabled && animations.length > 0) {
                    mixer = new THREE.AnimationMixer(model);

                    const clip = animations[A.singleIndex] || animations[0];
                    const action = mixer.clipAction(clip);
                    action.timeScale = A.speed;
                    action.play();

                    console.log(`🎬 Playing animation: "${clip.name}" (looping)`);
                } else if (!A.enabled) {
                    console.log('⏸️ Christ model animations disabled');
                } else {
                    console.log('⚠️ No animations found in Christ Model');
                }
            },
            undefined,
            (err) => console.error('❌ Christ Model load error:', err)
        );

        // ══════════════════════════════════════════════════════════════
        // ANIMATION LOOP
        // ══════════════════════════════════════════════════════════════

        function animate() {
            animFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            // Update animation mixer
            if (mixer) {
                mixer.update(delta);
            }

            // Mouse tracking + idle motions
            if (model) {
                if (MT.enabled) {
                    // Calculate target rotation based on mouse position
                    targetRotation.y = S.facingDirection + mouse.x * MT.maxRotationY;
                    targetRotation.x = mouse.y * MT.maxRotationX;

                    // Smoothly interpolate current rotation towards target
                    currentRotation.y += (targetRotation.y - currentRotation.y) * MT.smoothness;
                    currentRotation.x += (targetRotation.x - currentRotation.x) * MT.smoothness;

                    model.rotation.y = currentRotation.y;
                    model.rotation.x = currentRotation.x;
                }

                if (S.enableIdleFloat) {
                    model.position.y = baseY + Math.sin(elapsed * S.idleFloatSpeed) * S.idleFloatAmount;
                }
            }

            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        const handleResize = () => {
            const newWidth = container.clientWidth || 600;
            const newHeight = container.clientHeight || 600;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="christ-model-container"
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                zIndex: 5,
            }}
        />
    );
}

export default ChristModel;
