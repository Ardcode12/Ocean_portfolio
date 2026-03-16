import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ PROJECTS DATA — Edit your projects here                   ║
// ╚═══════════════════════════════════════════════════════════════╝
const PROJECTS = [
    {
        id: 1,
        title: 'Talent Tracker',
        description: 'A linkedin like Platform for sports persons and assessment models for training videos.Which increase the opurcunities for the sporsts person and the coaches can  reqcruit them ',
        tech: ['React-native', 'Python', 'postgresql'],
        color: '#00e5ff',
        links: { live: '#', code: '#' },
    },
    {
        id: 2,
        title: 'Mentro',
        description: 'It is a mentorship platform that connects students with experienced mentors in their field of interest. The platform allows students to find and connect with exprienced mentors and also havethe career path guidence and the resume skill gap anatysis for the jobs and the DNA analysis that analyzw their skill and all the career path and the job reccomendation based on the skill and the intrest and also a portfolio builder .',
        tech: ['React-native', 'Python', 'PostgreSQL',],
        color: '#a855f7',
        links: { live: '#', code: '#' },
    },
    {
        id: 3,
        title: 'Accident Auto Report',
        description: 'Machine learning system that analyzes camera footage to detect accidents , track accident and Automatically call tha ambulance nearby and also have the volunteer system.',
        tech: ['React-native', 'Python', 'Tensorflow', 'Postgresql'],
        color: '#10b981',
        links: { live: '#', code: '#' },
    },
    {
        id: 4,
        title: 'Surity Cart',
        description: 'An e-commerce platform that connects brands and Instagram influencers in a secure and trusted environment. The platform is designed to reduce scams by verifying users and ensuring transparent transactions.It builds trust between influencers, sellers, and customers through secure communication and payment systems.',
        tech: ['React', 'Node.js', 'Mongo db',],
        color: '#f59e0b',   
        links: { live: '#', code: '#' },
    },
    {
        id: 5,
        title: 'Change Wave',
        description: 'A platform in which campains can be created and anounced and people can participate in it and learn study modules and gain certificates.',
        tech: ['Html', 'Css','Node.js', 'MongoDB',],
        color: '#ec4899',
        links: { live: '#', code: '#' },
    },
];

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ PROJECT 3D MODELS — Edit position, size, rotation here    ║
// ╚═══════════════════════════════════════════════════════════════╝
const PROJECT_MODELS = [
    // ── PROJECT 1 MODEL ──
    {
        path: '/glb_files/turtle.glb',
        scale: 4,                    // ★ Size: 1.0=small, 2.5=medium, 4.0=large
        rotation: -Math.PI / 2 + 0.9,             // ★ Facing: 0=right, Math.PI=left, Math.PI/2=back
        position: { x: 0, y: 0, z: 0 }, // ★ Position offset: x=left/right, y=up/down, z=forward/back
        animationSpeed: 2,           // ★ Animation speed: 0.5=slow, 1.0=normal, 1.5=fast
        floatAmount: 0.1,              // ★ Floating motion: 0=none, 0.1=subtle, 0.3=large
        floatSpeed: 0.8,               // ★ Float speed: 0.5=slow, 1.0=normal
        swayAmount: 0.15,              // ★ Side-to-side sway: 0=none, 0.15=subtle
        swaySpeed: 0.3,                // ★ Sway speed
    },
    // ── PROJECT 2 MODEL ──
    {
        path: '/glb_files/model_65a_-_longnose_gar.glb',
        scale: 6,
        rotation: Math.PI / 2 - 0.8,
        position: { x: -1, y: -0.3, z: 0 },
        animationSpeed: 0.6,
        floatAmount: 0.08,
        floatSpeed: 0.6,
        swayAmount: 0.1,
        swaySpeed: 0.25,
    },
    // ── PROJECT 3 MODEL ──
    {
        path: '/glb_files/white_pointer.glb',
        scale: 5,
        rotation: -Math.PI / 2 + 0.8,
        position: { x: 0.5, y: 0, z: 0 },
        animationSpeed: 0.7,
        floatAmount: 0.12,
        floatSpeed: 0.7,
        swayAmount: 0.12,
        swaySpeed: 0.35,
    },
    // ── PROJECT 4 MODEL ──
    {
        path: '/glb_files/blue_whale_-_textured.glb',
        scale: 5,
        rotation: Math.PI / 2 - 0.7,
        position: { x: 0, y: 0, z: 0 },
        animationSpeed: 0.5,
        floatAmount: 0.15,
        floatSpeed: 0.5,
        swayAmount: 0.2,
        swaySpeed: 0.2,
    },
    // ── PROJECT 5 MODEL ──
    {
        path: '/glb_files/guppie_animated.glb',
        scale: 4,
        rotation: Math.PI,
        position: { x: 1, y: -0.5, z: 0 },
        animationSpeed: 1.0,
        floatAmount: 0.1,
        floatSpeed: 1.0,
        swayAmount: 0.1,
        swaySpeed: 0.4,
    },
];



// ╔═══════════════════════════════════════════════════════════════╗
// ║  3D MODEL COMPONENT                                           ║
// ╚═══════════════════════════════════════════════════════════════╝
function ProjectModel({ modelConfig, index }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || 400;
        const height = container.clientHeight || 400;

        // Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0.5, 5);
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

        let mixer = null;
        let model = null;
        let baseY = 0;
        const clock = new THREE.Clock();
        let animFrameId;

        const config = modelConfig;

        // Load model
        const loader = new GLTFLoader();
        loader.load(
            config.path,
            (gltf) => {
                model = gltf.scene;

                // Scale and center
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = config.scale / maxDim;

                model.scale.setScalar(scale);

                baseY = -center.y * scale + config.position.y;

                model.position.set(
                    -center.x * scale + config.position.x,
                    baseY,
                    -center.z * scale + config.position.z
                );
                model.rotation.y = config.rotation;

                // Enhance materials
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

                // Play animation if available
                if (gltf.animations && gltf.animations.length > 0) {
                    mixer = new THREE.AnimationMixer(model);
                    const action = mixer.clipAction(gltf.animations[0]);
                    action.timeScale = config.animationSpeed;
                    action.play();
                }

                console.log(`🐠 Project model ${index + 1} loaded: ${config.path}`);
            },
            undefined,
            (err) => console.error(`❌ Model load error:`, err)
        );

        // Animation loop
        function animate() {
            animFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            if (mixer) mixer.update(delta);

            // Floating and swaying motion
            if (model) {
                // Float up/down
                model.position.y = baseY + Math.sin(elapsed * config.floatSpeed) * config.floatAmount;

                // Sway rotation
                model.rotation.y = config.rotation + Math.sin(elapsed * config.swaySpeed) * config.swayAmount;
            }

            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        const handleResize = () => {
            const newWidth = container.clientWidth || 400;
            const newHeight = container.clientHeight || 400;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [modelConfig, index]);

    return <div ref={containerRef} className="project-model-container" />;
}

// ╔═══════════════════════════════════════════════════════════════╗
// ║  PROJECT ROW COMPONENT                                        ║
// ╚═══════════════════════════════════════════════════════════════╝
function ProjectRow({ project, model, index, isReversed }) {
    return (
        <div
            className={`project-row ${isReversed ? 'project-row-reversed' : ''}`}
            data-project-index={index}
            id={`project-${index}`}
        >
            {/* Project Card */}
            <div className="project-card-side">
                <div className="project-card glass-card" style={{ '--accent-color': project.color }}>
                    <div
                        className="project-card-glow"
                        style={{ background: `radial-gradient(circle, ${project.color}20 0%, transparent 70%)` }}
                    />

                    <div className="project-card-header">
                        <span className="project-number" style={{ color: project.color }}>
                            {String(project.id).padStart(2, '0')}
                        </span>
                        <div className="project-card-line" style={{ background: project.color }} />
                    </div>

                    <h3 className="project-card-title">{project.title}</h3>
                    <p className="project-card-desc">{project.description}</p>

                    <div className="project-card-tech">
                        {project.tech.map((tech) => (
                            <span
                                key={tech}
                                className="tech-tag"
                                style={{ borderColor: `${project.color}40`, color: project.color }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="project-card-links">
                        <a
                            href={project.links.live}
                            className="btn btn-sm btn-primary"
                            style={{ background: project.color }}
                        >
                            Live Demo
                        </a>
                        <a href={project.links.code} className="btn btn-sm btn-ghost">
                            View Code
                        </a>
                    </div>
                </div>
            </div>

            {/* 3D Model */}
            <div className="project-model-side">
                <ProjectModel modelConfig={model} index={index} />
            </div>
        </div>
    );
}

// ╔═══════════════════════════════════════════════════════════════╗
// ║  MAIN PROJECTS COMPONENT                                      ║
// ╚═══════════════════════════════════════════════════════════════╝
function Projects() {
    useEffect(() => {
        // Scroll-triggered animations for each project row
        const rows = document.querySelectorAll('.project-row');

        rows.forEach((row) => {
            const card = row.querySelector('.project-card-side');
            const model = row.querySelector('.project-model-side');
            const isReversed = row.classList.contains('project-row-reversed');

            gsap.fromTo(
                card,
                {
                    opacity: 0,
                    x: isReversed ? 100 : -100,
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 75%',
                        end: 'top 25%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            gsap.fromTo(
                model,
                {
                    opacity: 0,
                    x: isReversed ? -100 : 100,
                    scale: 0.8,
                },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 75%',
                        end: 'top 25%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });
    }, []);

    return (
        <section id="projects" className="section projects-section">
            <div className="section-inner">
                <div className="section-label center-label">03 — Projects</div>
                <h2 className="section-title center-title">
                    Deep <span className="glow-text">Dives</span>
                </h2>

                <div className="projects-container">
                    {PROJECTS.map((project, index) => (
                        <ProjectRow
                            key={project.id}
                            project={project}
                            model={PROJECT_MODELS[index % PROJECT_MODELS.length]}
                            index={index}
                            isReversed={index % 2 === 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Projects;