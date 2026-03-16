import React, { useState } from 'react';
import ChristModel from './ChristModel';

function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            e.target.reset();
        }, 3000);
    };

    return (
        <section id="contact" className="section">
            <div className="section-inner split-layout split-right">
                {/* Christ side (LEFT) */}
                <div className="fish-side" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChristModel />
                </div>
                {/* Content side (RIGHT) */}
                <div className="content-side">
                    <div className="section-label">04 — Contact</div>
                    <h2 className="section-title">
                        Let's <span className="glow-text">Connect</span>
                    </h2>
                    <div className="glass-card contact-card">
                        <p className="contact-intro">Have a project in mind? Let's create something extraordinary together.</p>
                        <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" placeholder="Arnald " required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="arnald@gmail.com" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" placeholder="Tell me about your project..." rows="4" required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-submit">
                                <span>{submitted ? 'Sent! 🌊' : 'Send Message'}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
                                </svg>
                            </button>
                        </form>
                    </div>
                    <div className="social-row">
                        <a href="#" className="social-pill"><span>🐙</span> GitHub</a>
                        <a href="#" className="social-pill"><span>💼</span> LinkedIn</a>
                        <a href="#" className="social-pill"><span>🐦</span> Twitter</a>
                        <a href="#" className="social-pill"><span>📧</span> Email</a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
