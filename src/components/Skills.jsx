import React, { useState, useEffect, useRef } from 'react';
import OctoModel from './OctoModel';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const SKILLS_DATA = [
    { category: 'frontend', skill: 'HTML', icon: `${DEVICON}/html5/html5-original.svg`, pct: 95 },
    { category: 'frontend', skill: 'CSS', icon: `${DEVICON}/css3/css3-original.svg`, pct: 92 },
    { category: 'frontend', skill: 'JavaScript', icon: `${DEVICON}/javascript/javascript-original.svg`, pct: 90 },
    { category: 'frontend', skill: 'React', icon: `${DEVICON}/react/react-original.svg`, pct: 85 },
    { category: 'frontend', skill: 'Three.js', icon: `${DEVICON}/threejs/threejs-original-wordmark.svg`, pct: 80 },

    { category: 'backend', skill: 'Node.js', icon: `${DEVICON}/nodejs/nodejs-original.svg`, pct: 85 },
    { category: 'backend', skill: 'Python', icon: `${DEVICON}/python/python-original.svg`, pct: 75 },
    { category: 'backend', skill: 'Django', icon: `${DEVICON}/django/django-plain.svg`, pct: 70 },
    { category: 'backend', skill: 'Flask', icon: `${DEVICON}/flask/flask-original.svg`, pct: 72 },

    { category: 'backend', skill: 'PostgreSQL', icon: `${DEVICON}/postgresql/postgresql-original.svg`, pct: 78 },
    { category: 'backend', skill: 'SQL', icon: `${DEVICON}/azuresqldatabase/azuresqldatabase-original.svg`, pct: 80 },
    { category: 'backend', skill: 'MongoDB', icon: `${DEVICON}/mongodb/mongodb-original.svg`, pct: 80 },

    { category: 'ml', skill: 'TensorFlow', icon: `${DEVICON}/tensorflow/tensorflow-original.svg`, pct: 70 },
    { category: 'ml', skill: 'OpenCV', icon: `${DEVICON}/opencv/opencv-original.svg`, pct: 68 },

    { category: 'tools', skill: 'Git', icon: `${DEVICON}/git/git-original.svg`, pct: 90 },
    { category: 'tools', skill: 'Linux', icon: `${DEVICON}/linux/linux-original.svg`, pct: 82 },
];

const TABS = [
    { id: 'all', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3z" /><path d="M9 9h6v6H9z" /></svg>, label: 'All' },
    { id: 'frontend', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L12 12l3.745 3.745A9.865 9.865 0 0020 12z" /><path d="M4 12c0-4.418 4.03-8 9-8s9 3.582 9 8" /></svg>, label: 'Frontend' },
    { id: 'backend', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>, label: 'Backend' },
    { id: 'ml', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m16.24-3.76l-4.24 4.24m-6-6L2.76 6.24m16.24 11.52l-4.24-4.24m-6 6L2.76 17.76" /></svg>, label: 'ML' },
    { id: 'tools', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>, label: 'Tools' },
];

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ ROTATION SETTINGS                                          ║
// ╚═══════════════════════════════════════════════════════════════╝
const ROTATION_SETTINGS = {
    enabled: true,
    degreesPerSecond: 8,         // ★ Speed: 5=slow, 15=medium, 30=fast
    direction: 1,                 // ★ 1=clockwise, -1=counter-clockwise
    pauseOnHover: true,
};

function Skills() {
    const [activeTab, setActiveTab] = useState('all');
    const rotationRef = useRef(0);
    const skillRefs = useRef([]);
    const orbitRingRef = useRef(null);
    const isPausedRef = useRef(false);
    const lastTimeRef = useRef(0);
    const animFrameRef = useRef(null);

    const filteredSkills =
        activeTab === 'all'
            ? SKILLS_DATA
            : SKILLS_DATA.filter((s) => s.category === activeTab);

    const CIRCLE_RADIUS = filteredSkills.length <= 6 ? 220 : 270;
    const CIRCLE_SIZE = CIRCLE_RADIUS * 2 + 140;

    // ── Animation loop — moves each skill individually ──
    useEffect(() => {
        if (!ROTATION_SETTINGS.enabled) return;

        // Reset refs array for current filtered skills
        skillRefs.current = skillRefs.current.slice(0, filteredSkills.length);

        function animate(currentTime) {
            if (lastTimeRef.current === 0) {
                lastTimeRef.current = currentTime;
            }

            const deltaTime = (currentTime - lastTimeRef.current) / 1000;
            lastTimeRef.current = currentTime;

            if (!isPausedRef.current) {
                // Update rotation angle
                rotationRef.current += ROTATION_SETTINGS.degreesPerSecond * ROTATION_SETTINGS.direction * deltaTime;

                // Rotate orbit ring
                if (orbitRingRef.current) {
                    orbitRingRef.current.style.transform = `translate(-50%, -50%) rotate(${rotationRef.current}deg)`;
                }

                // Update each skill position — they orbit but stay upright
                skillRefs.current.forEach((el, i) => {
                    if (!el) return;

                    const baseAngle = (360 / filteredSkills.length) * i - 90;
                    const currentAngle = baseAngle + rotationRef.current;
                    const angleRad = currentAngle * (Math.PI / 180);

                    const x = Math.cos(angleRad) * CIRCLE_RADIUS;
                    const y = Math.sin(angleRad) * CIRCLE_RADIUS;

                    // Move position, but NO rotation on the skill itself
                    el.style.left = `calc(50% + ${x}px)`;
                    el.style.top = `calc(50% + ${y}px)`;
                });
            }

            animFrameRef.current = requestAnimationFrame(animate);
        }

        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [filteredSkills.length, CIRCLE_RADIUS]);

    // Reset animation when tab changes
    useEffect(() => {
        lastTimeRef.current = 0;
    }, [activeTab]);

    // ── Hover handlers ──
    const handleMouseEnter = () => {
        if (ROTATION_SETTINGS.pauseOnHover) {
            isPausedRef.current = true;
        }
        // Play hover sound
        const hoverAudio = new Audio('/sounds/hover-bubble.mp3');
        hoverAudio.volume = 0.5;
        hoverAudio.play().catch(e => console.log('Hover audio failed', e));
    };

    const handleMouseLeave = () => {
        if (ROTATION_SETTINGS.pauseOnHover) {
            isPausedRef.current = false;
        }
    };

    return (
        <section id="skills" className="section">
            <div className="section-inner">
                <div className="section-label center-label">02 — Skills</div>
                <h2 className="section-title center-title" style={{ marginBottom: '20px' }}>
                    My <span className="glow-text">Arsenal</span>
                </h2>

                <div className="depth-tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`depth-tab${activeTab === tab.id ? ' active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="skills-layout">
                    <div className="skills-circle-side">
                        <div className="skills-circle-wrapper">
                            <div
                                className="skills-circle"
                                style={{
                                    width: `${CIRCLE_SIZE}px`,
                                    height: `${CIRCLE_SIZE}px`,
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* ★ 3D Model — FIXED in center */}
                                <OctoModel size={CIRCLE_SIZE} />

                                {/* ★ Orbit ring — rotates */}
                                <div
                                    ref={orbitRingRef}
                                    className="orbit-ring"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        width: `${CIRCLE_RADIUS * 2}px`,
                                        height: `${CIRCLE_RADIUS * 2}px`,
                                        transform: 'translate(-50%, -50%)',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(0, 229, 255, 0.15)',
                                        pointerEvents: 'none',
                                    }}
                                />

                                {/* ★ Skill orbs — orbit around but stay UPRIGHT */}
                                {filteredSkills.map((s, i) => {
                                    // Initial position (will be updated by animation)
                                    const baseAngle = (360 / filteredSkills.length) * i - 90;
                                    const angleRad = baseAngle * (Math.PI / 180);
                                    const x = Math.cos(angleRad) * CIRCLE_RADIUS;
                                    const y = Math.sin(angleRad) * CIRCLE_RADIUS;

                                    return (
                                        <div
                                            key={s.skill}
                                            ref={(el) => (skillRefs.current[i] = el)}
                                            className="skill-orb-positioned"
                                            style={{
                                                position: 'absolute',
                                                left: `calc(50% + ${x}px)`,
                                                top: `calc(50% + ${y}px)`,
                                                transform: 'translate(-50%, -50%)',
                                                // ★ NO rotation — stays upright
                                            }}
                                            data-category={s.category}
                                        >
                                            <div className="orb-ring">
                                                <svg viewBox="0 0 120 120">
                                                    <circle cx="60" cy="60" r="52" className="orb-track" />
                                                    <circle cx="60" cy="60" r="52" className="orb-fill" style={{ '--pct': s.pct }} />
                                                </svg>
                                                <div className="orb-center">
                                                    <img className={`orb-icon${['Three.js', 'Linux', 'Django', 'Flask'].includes(s.skill) ? ' dark-icon' : ''}`} src={s.icon} alt={s.skill} />
                                                    <span className="orb-value">{s.pct}%</span>
                                                </div>
                                            </div>
                                            <span className="orb-label">{s.skill}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="skills-fish-side" />
                </div>
            </div>
        </section>
    );
}

export default Skills;