import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ACHIEVEMENT_FISH_POSITIONS } from './Achievements';

gsap.registerPlugin(ScrollTrigger);

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ MAIN FISH SETTINGS — DESKTOP                              ║
// ╚═══════════════════════════════════════════════════════════════╝
const FISH_SECTIONS_DESKTOP = {
    hero: {
        size: 8,
        position: { x: 2, y: 2, z: 4 },
        rotation: -Math.PI / 2 - 0.8,
        animation: 0,
    },
    about: {
        size: 6,
        position: { x: -4, y: 1.5, z: 5 },
        rotation: -Math.PI / 2 + 0.3,
        animation: 1,
        switchToAnimation: 0,
        switchAfterLoops: 1,
    },
    skills: {
        size: 6,
        position: { x: 3.5, y: 1, z: 5 },
        rotation: -Math.PI / 2 - 0.5,
        animation: 0,
    },
    projects: {
        size: 0,
        position: { x: 0, y: -20, z: 0 },
        rotation: 0,
        animation: 0,
    },
    achievements: {
        size: 5,
        position: { x: 3, y: 1.5, z: 6 },
        rotation: -Math.PI / 2 - 0.9,
        animation: 0,
    },
    contact: {
        size: 0,
        position: { x: 0, y: -20, z: 0 },
        rotation: 0,
        animation: 0,
    },
};

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ MAIN FISH SETTINGS — MOBILE (≤ 768px)                     ║
// ║  Smaller sizes, centered positions so fish doesn't overlap   ║
// ╚═══════════════════════════════════════════════════════════════╝
const FISH_SECTIONS_MOBILE = {
    hero: {
        size: 4,
        position: { x: 0, y: 1, z: 6 },
        rotation: -Math.PI / 2 - 0.5,
        animation: 0,
    },
    about: {
        size: 3,
        position: { x: 0, y: 2, z: 7 },
        rotation: -Math.PI / 2 + 0.3,
        animation: 1,
        switchToAnimation: 0,
        switchAfterLoops: 1,
    },
    skills: {
        size: 3,
        position: { x: 0, y: 1, z: 7 },
        rotation: -Math.PI / 2 - 0.5,
        animation: 0,
    },
    projects: {
        size: 0,
        position: { x: 0, y: -20, z: 0 },
        rotation: 0,
        animation: 0,
    },
    achievements: {
        size: 3.5,
        position: { x: 0, y: -2, z: 8 },
        rotation: -Math.PI / 2,
        animation: 0,
    },
    contact: {
        size: 0,
        position: { x: 0, y: -20, z: 0 },
        rotation: 0,
        animation: 0,
    },
};

function getIsMobile() {
    return window.innerWidth <= 768;
}

function getFishSections() {
    return getIsMobile() ? FISH_SECTIONS_MOBILE : FISH_SECTIONS_DESKTOP;
}

function OceanCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
        camera.position.set(0, 2, 12);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lights
        scene.add(new THREE.AmbientLight(0x4a8aaa, 2.0));
        const sun = new THREE.DirectionalLight(0xffffff, 2.5);
        sun.position.set(5, 10, 10);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0x88bbdd, 1.5);
        fill.position.set(-5, 5, 10);
        scene.add(fill);

        // Fish state
        let fishGroup = null;
        let fishModel = null;
        let mixer = null;
        let animations = [];
        let currentAction = null;
        let currentSection = 'hero';
        let currentAchievementIndex = 0;
        const initSettings = getFishSections().hero;
        let currentSize = initSettings.size;
        let targetSize = initSettings.size;
        let currentRotation = initSettings.rotation;
        let targetRotation = initSettings.rotation;
        let currentPos = { ...initSettings.position };
        let targetPos = { ...initSettings.position };
        let animationLoopCount = 0;
        let waitingToSwitch = false;

        const clock = new THREE.Clock();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        function playAnimation(index) {
            if (!mixer || !animations[index]) {
                console.log(`⚠️ Animation ${index} not found`);
                return;
            }

            const clip = animations[index];
            const filteredClip = clip.clone();
            filteredClip.tracks = filteredClip.tracks.filter(
                (track) => !track.name.includes('.position')
            );

            if (currentAction) {
                currentAction.fadeOut(0.5);
            }

            const action = mixer.clipAction(filteredClip);
            action.reset();
            action.fadeIn(0.5);
            action.play();

            currentAction = action;
            animationLoopCount = 0;

            console.log(`🎬 Playing animation [${index}]: "${clip.name}"`);
        }

        function onAnimationLoop() {
            animationLoopCount++;
            const sectionSettings = getFishSections()[currentSection];

            if (
                sectionSettings &&
                sectionSettings.switchToAnimation !== undefined &&
                sectionSettings.switchAfterLoops !== undefined &&
                animationLoopCount >= sectionSettings.switchAfterLoops &&
                !waitingToSwitch
            ) {
                waitingToSwitch = true;
                playAnimation(sectionSettings.switchToAnimation);
                waitingToSwitch = false;
            }
        }

        function switchToSection(sectionId, force = false) {
            if (!force && currentSection === sectionId && sectionId !== 'achievements') return;

            currentSection = sectionId;
            const sections = getFishSections();
            const settings = sections[sectionId];
            if (!settings) return;

            console.log(`📍 Entering section: ${sectionId}`);

            targetPos = { ...settings.position };
            targetSize = settings.size;
            targetRotation = settings.rotation;

            animationLoopCount = 0;
            waitingToSwitch = false;
            playAnimation(settings.animation);
        }

        // ★ NEW: Switch fish position based on which achievement is in view
        function switchToAchievement(achievementIndex) {
            if (achievementIndex < 0 || achievementIndex >= ACHIEVEMENT_FISH_POSITIONS.length) return;
            if (currentSection === 'achievements' && currentAchievementIndex === achievementIndex) return;

            currentSection = 'achievements';
            currentAchievementIndex = achievementIndex;

            const settings = ACHIEVEMENT_FISH_POSITIONS[achievementIndex];
            console.log(`🐟 Fish moving for Achievement ${achievementIndex + 1}`);

            let pos = { ...settings.position };
            if (getIsMobile()) {
                pos.x = 0; // Keep centered on mobile
            }

            targetPos = pos;
            targetSize = getIsMobile() ? 3.5 : settings.size; // scale down on mobile somewhat if desired
            targetRotation = getIsMobile() ? -Math.PI / 2 : settings.rotation;

            animationLoopCount = 0;
            waitingToSwitch = false;
            playAnimation(settings.animation);
        }

        function setupScrollTriggers() {
            // Section triggers (non-projects)
            ['hero', 'about', 'skills', 'projects', 'contact'].forEach((id) => {
                ScrollTrigger.create({
                    trigger: '#' + id,
                    start: 'top center',
                    end: 'bottom center',
                    onEnter: () => switchToSection(id),
                    onEnterBack: () => switchToSection(id),
                });
            });

            // ★ Individual achievement triggers
            ACHIEVEMENT_FISH_POSITIONS.forEach((_, index) => {
                ScrollTrigger.create({
                    trigger: `#achievement-${index}`,
                    start: 'top center',
                    end: 'bottom center',
                    onEnter: () => switchToAchievement(index),
                    onEnterBack: () => switchToAchievement(index),
                });
            });
        }

        // Load main fish
        loader.load(
            '/glb_files/main_fish.glb',
            (gltf) => {
                fishModel = gltf.scene;

                const box = new THREE.Box3().setFromObject(fishModel);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);

                fishModel.userData.originalMaxDim = maxDim;

                const heroSettings = getFishSections().hero;
                const scale = heroSettings.size / maxDim;
                fishModel.scale.setScalar(scale);

                const center = box.getCenter(new THREE.Vector3());
                fishModel.userData.centerOffset = {
                    x: -center.x,
                    y: -center.y,
                    z: -center.z,
                };

                fishModel.position.set(
                    fishModel.userData.centerOffset.x * scale,
                    fishModel.userData.centerOffset.y * scale,
                    fishModel.userData.centerOffset.z * scale
                );

                fishModel.rotation.y = heroSettings.rotation;

                fishModel.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.envMapIntensity = 1.5;
                        if (child.material.emissive) {
                            child.material.emissive.set(0x224466);
                            child.material.emissiveIntensity = 0.2;
                        }
                        child.material.needsUpdate = true;
                    }
                });

                fishGroup = new THREE.Group();
                fishGroup.add(fishModel);
                fishGroup.position.set(
                    heroSettings.position.x,
                    heroSettings.position.y,
                    heroSettings.position.z
                );
                scene.add(fishGroup);

                console.log('✅ Main fish loaded');

                animations = gltf.animations;
                console.log(`📽️ Main fish has ${animations.length} animations`);

                mixer = new THREE.AnimationMixer(fishModel);
                mixer.addEventListener('loop', onAnimationLoop);
                playAnimation(heroSettings.animation);

                setupScrollTriggers();

                // ★ Force correct initial state after triggers are set up
                // On fresh load, the page is at top so hero's onEnter may not fire.
                // Explicitly ensure hero state is applied.
                ScrollTrigger.refresh();
                requestAnimationFrame(() => {
                    switchToSection('hero', true);
                });
            },
            undefined,
            (err) => console.error('❌ Main fish error:', err)
        );

        // Animation loop
        let animFrameId;
        function animate() {
            animFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();

            if (mixer) {
                mixer.update(delta);
            }

            if (fishGroup && fishModel) {
                const smooth = 0.08;
                const sizeSmoothness = 0.08;

                currentPos.x += (targetPos.x - currentPos.x) * smooth;
                currentPos.y += (targetPos.y - currentPos.y) * smooth;
                currentPos.z += (targetPos.z - currentPos.z) * smooth;
                fishGroup.position.set(currentPos.x, currentPos.y, currentPos.z);

                currentSize += (targetSize - currentSize) * sizeSmoothness;
                const newScale = currentSize / fishModel.userData.originalMaxDim;
                fishModel.scale.setScalar(newScale);

                fishModel.position.set(
                    fishModel.userData.centerOffset.x * newScale,
                    fishModel.userData.centerOffset.y * newScale,
                    fishModel.userData.centerOffset.z * newScale
                );

                currentRotation += (targetRotation - currentRotation) * smooth;
                fishModel.rotation.y = currentRotation;

                const movingLeft = targetPos.x < currentPos.x - 0.1;
                const movingRight = targetPos.x > currentPos.x + 0.1;

                let turnAmount = 0;
                if (movingLeft) turnAmount = 0.1;
                else if (movingRight) turnAmount = -0.1;

                fishGroup.rotation.y += (turnAmount - fishGroup.rotation.y) * smooth;
            }

            renderer.render(scene, camera);
        }
        animate();

        // Resize handler — also re-position fish for mobile/desktop switch
        let wasMobile = getIsMobile();
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Re-trigger current section if crossing the mobile breakpoint
            const isMobileNow = getIsMobile();
            if (isMobileNow !== wasMobile) {
                wasMobile = isMobileNow;
                switchToSection(currentSection, true);
            }
        };
        window.addEventListener('resize', handleResize);

        console.log('🌊 Portfolio Ready - Main Fish with Per-Project Positions');

        // Cleanup
        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return <canvas id="ocean-canvas" ref={canvasRef}></canvas>;
}

export default OceanCanvas;