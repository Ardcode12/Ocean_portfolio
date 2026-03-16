import React from 'react';

function Hero() {
    return (
        <section id="hero" className="section">
            <div className="section-inner hero-layout">
                {/* Content side (LEFT) */}
                <div className="content-side hero-content">
                   
                    <h1 className="hero-title">
                        <span className="hero-line line-1">Hello, I'm</span>
                        <span className="hero-line line-2 glow-text">Arnald S</span>
                        <span className="hero-line line-3">
                            Developer <span className="amp">&amp;</span> Creator
                        </span>
                    </h1>
                    <p className="hero-subtitle">
                        I craft immersive digital experiences from the depths of imagination — where code meets creativity.
                    </p>
                    <div className="hero-cta">
                        <a href="#projects" className="btn btn-primary">
                            <span>Explore My Work</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                        </a>
                        <a href="#contact" className="btn btn-ghost">Say Hello</a>
                    </div>
                </div>
                {/* Fish side (RIGHT) */}
                <div className="fish-side"></div>
            </div>
            <div className="scroll-indicator">
                <div className="scroll-line"></div>
                <span>Scroll</span>
            </div>
        </section>
    );
}

export default Hero;
