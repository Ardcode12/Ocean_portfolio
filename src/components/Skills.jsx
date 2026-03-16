import React, { useState, useEffect, useRef } from 'react';
import OctoModel from './OctoModel';

const SKILLS_DATA = [
    { category: 'frontend', skill: 'HTML/CSS', icon: '🏗️', pct: 95 },
    { category: 'frontend', skill: 'JavaScript', icon: '⚡', pct: 90 },
    { category: 'frontend', skill: 'React', icon: '⚛️', pct: 85 },
    { category: 'frontend', skill: 'Three.js', icon: '🎮', pct: 80 },
   
    { category: 'backend', skill: 'Node.js', icon: '🟢', pct: 85 },
    { category: 'backend', skill: 'Python', icon: '🐍', pct: 75 },
    { category: 'backend', skill: 'MongoDB', icon: '🍃', pct: 80 },
   
    { category: 'tools', skill: 'Git', icon: '🔧', pct: 90 },
    
    
    { category: 'tools', skill: 'Linux', icon: '🐧', pct: 82 },
];

const TABS = [
    { id: 'all', icon: '🌊', label: 'All' },
    { id: 'frontend', icon: '🐠', label: 'Frontend' },
    { id: 'backend', icon: '🐙', label: 'Backend' },
    { id: 'tools', icon: '⚓', label: 'Tools' },
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
                                                    <span className="orb-icon">{s.icon}</span>
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