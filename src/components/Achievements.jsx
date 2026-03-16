import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ ICON COMPONENTS                                           ║
// ╚═══════════════════════════════════════════════════════════════╝
const TrophyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="7" />
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
    </svg>
);

const StarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
    </svg>
);

const MedalIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="7" />
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
    </svg>
);

const DocumentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
    </svg>
);

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ ACHIEVEMENTS DATA                                          ║
// ╚═══════════════════════════════════════════════════════════════╝
const ACHIEVEMENTS = [
    {
        id: 1,
        title: '2nd in 24hrs Hackathon',
        description: 'Won a 2nd place in the 24 hrs national level hackathon in "Dr.NGP institution"  and won 15000k cash price',
        icon: TrophyIcon,
        year: '2026',
        category: 'Hackathon',
        color: '#ffd700',
    },
    {
        id: 2,
        title: 'Won Paper presentation ',
        description: 'Partcipated in paper presentation in national level technical sysposium conducted in "Salem Engineering College" and won 1st place',
        icon: StarIcon,
        year: '2025 ',
        category: 'Paper presentation',
        color: '#00e5ff',
    },
    {
        id: 3,
        title: 'Madathon',
        description: 'Won 1st place in inter college 8hrs hackathon  in the event madathon',
        icon: MedalIcon,
        year: '2025',
        category: 'Hackathon',
        color: '#10b981',
    },
    {
        id: 4,
        title: 'Coding Contest ',
        description: 'Won coding contest in the national level symposiym conducted in the "Salem Enginnering College"',
        icon: DocumentIcon,
        year: '2025',
        category: 'Coding ',
        color: '#a855f7',
    },
    {
        id: 5,
        title: 'Medinova',
        description: 'A 8 hrs Hackathon conducted by the red ribon club and won the 1st place',
        icon: TrophyIcon,
        year: '2025',
        category: 'Hackathon',
        color: '#ec4899',
    },


];

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ MAIN FISH POSITIONS — fish swims on the RIGHT side         ║
// ╚═══════════════════════════════════════════════════════════════╝
export const ACHIEVEMENT_FISH_POSITIONS = [
    { size: 5, position: { x: 3, y: 1.5, z: 6 }, rotation: -Math.PI / 2 - 0.9, animation: 0 },
    { size: 5, position: { x: 3, y: 1.5, z: 6 }, rotation: -Math.PI / 2 - 0.9, animation: 2 },
    { size: 5, position: { x: 3, y: 1.5, z: 6 }, rotation: -Math.PI / 2 - 0.9, animation: 0 },
    { size: 5, position: { x: 3, y: 1.5, z: 6 }, rotation: -Math.PI / 2 - 0.9, animation: 0 },
    { size: 5, position: { x: 3, y: 1.5, z: 6 }, rotation: -Math.PI / 2 - 0.9, animation: 0 },
];

// ╔═══════════════════════════════════════════════════════════════╗
// ║  TIMELINE ITEM                                                 ║
// ╚═══════════════════════════════════════════════════════════════╝
function TimelineItem({ achievement, index, isLast }) {
    return (
        <div
            id={`achievement-${index}`}
            className="tl-item"
            style={{ '--accent': achievement.color }}
            data-aos="fade-up"
            data-aos-delay={index * 80}
            data-aos-duration="700"
            data-aos-once="true"
        >
            {/* Timeline spine: dot + line */}
            <div className="tl-spine">
                <div
                    className="tl-dot"
                    style={{
                        background: achievement.color,
                        boxShadow: `0 0 12px ${achievement.color}60, 0 0 24px ${achievement.color}25`,
                    }}
                >
                    <span className="tl-dot-icon"><achievement.icon /></span>
                </div>
                {!isLast && <div className="tl-line" />}
            </div>

            {/* Card */}
            <div className="tl-card">
                {/* Top accent glow */}
                <div
                    className="tl-card-accent"
                    style={{ background: `linear-gradient(90deg, ${achievement.color}40, transparent)` }}
                />

                {/* Year badge */}
                <div className="tl-card-year" style={{ color: achievement.color }}>
                    {achievement.year}
                </div>

                {/* Category */}
                <span
                    className="tl-card-cat"
                    style={{ color: achievement.color, borderColor: `${achievement.color}40` }}
                >
                    {achievement.category}
                </span>

                {/* Title */}
                <h3 className="tl-card-title">{achievement.title}</h3>

                {/* Description */}
                <p className="tl-card-desc">{achievement.description}</p>

                {/* Bottom wave decoration */}
                <svg className="tl-card-wave" viewBox="0 0 300 16" preserveAspectRatio="none">
                    <path
                        d="M0,10 C30,4 60,16 90,10 C120,4 150,16 180,10 C210,4 240,16 270,10 L300,10"
                        fill="none"
                        stroke={achievement.color}
                        strokeWidth="1"
                        strokeOpacity="0.2"
                    />
                </svg>
            </div>
        </div>
    );
}

// ╔═══════════════════════════════════════════════════════════════╗
// ║  MAIN ACHIEVEMENTS COMPONENT — Split Layout + Timeline         ║
// ╚═══════════════════════════════════════════════════════════════╝
function Achievements() {
    useEffect(() => {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
        });
    }, []);

    return (
        <section id="achievements" className="section achievements-section">
            <div className="section-inner">
                {/* Header */}
                <div className="section-label" data-aos="fade-right" data-aos-duration="600">
                    04 — Achievements
                </div>
                <h2 className="section-title" data-aos="fade-right" data-aos-duration="700" data-aos-delay="100">
                    Treasures of the <span className="glow-text">Deep</span>
                </h2>

                {/* Split: timeline LEFT, fish RIGHT */}
                <div className="split-layout split-left">
                    <div className="content-side ach-content-side">
                        <div className="tl-container">
                            {ACHIEVEMENTS.map((achievement, index) => (
                                <TimelineItem
                                    key={achievement.id}
                                    achievement={achievement}
                                    index={index}
                                    isLast={index === ACHIEVEMENTS.length - 1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Fish side */}
                    <div className="fish-side ach-fish-side" />
                </div>
            </div>
        </section>
    );
}

export default Achievements;