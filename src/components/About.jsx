import React from 'react';

function About() {
    return (
        <section id="about" className="section">
            <div className="section-inner split-layout split-right">
                {/* Fish side (LEFT) */}
                <div className="fish-side"></div>
                {/* Content side (RIGHT) */}
                <div className="content-side">
                    <div className="section-label">01 — About</div>
                    <h2 className="section-title">
                        Exploring the <span className="glow-text">Depths</span>
                    </h2>
                    <div className="glass-card about-card">
                        <p className="about-text">
                            I'm a passionate full-stack developer and freelancer who thrives on building immersive, creative web experiences.
                            With expertise spanning from pixel-perfect front-end design to robust back-end systems, I bring ideas to life
                            with precision and artistry — delivering high-quality projects for clients worldwide.
                        </p>
                        <p className="about-text">
                            As a freelancer, I work closely with clients to turn their visions into reality — from mobile apps to full-stack
                            platforms. Like an ocean explorer, I chart unknown depths — mastering new technologies, solving complex problems,
                            and pushing the boundaries of what's possible.
                        </p>
                    </div>
                    <div className="stats-row">
                       
                        <div className="stat-item">
                            <span className="stat-number" data-count="15">15+</span>
                            <span className="stat-label">Projects</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number" data-count="10">10+</span>
                            <span className="stat-label">Technologies</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number" data-count="150">150+</span>
                            <span className="stat-label">LeetCode</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
