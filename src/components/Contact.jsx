import React, { useState, useRef } from 'react';
import ChristModel from './ChristModel';

// ╔═══════════════════════════════════════════════════════════════╗
// ║  ★ WEB3FORMS CONFIG                                           ║
// ║  Get your FREE access key at: https://web3forms.com           ║
// ║  1. Go to web3forms.com                                       ║
// ║  2. Enter YOUR email address                                  ║
// ║  3. Copy the access key and paste it below                    ║
// ╚═══════════════════════════════════════════════════════════════╝
const WEB3FORMS_ACCESS_KEY = 'fa858a75-ed62-4e30-b702-6d81ac74eb6f'; // ★ Replace with your key!

function Contact() {
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error
    const [errorMsg, setErrorMsg] = useState('');
    const formRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        const formData = new FormData(e.target);
        formData.append('access_key', WEB3FORMS_ACCESS_KEY);
        formData.append('subject', `Portfolio Contact from ${formData.get('name')}`);
        formData.append('from_name', 'Ocean Portfolio');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setStatus('sent');
                e.target.reset();
                setTimeout(() => setStatus('idle'), 4000);
            } else {
                setStatus('error');
                setErrorMsg(result.message || 'Something went wrong. Please try again.');
                setTimeout(() => setStatus('idle'), 4000);
            }
        } catch (err) {
            setStatus('error');
            setErrorMsg('Network error. Please check your connection and try again.');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    const buttonLabel = {
        idle: 'Send Message',
        sending: 'Sending...',
        sent: '✓ Message Sent!',
        error: 'Failed — Try Again',
    };

    return (
        <section id="contact" className="section">
            <div className="section-inner split-layout split-right">
                {/* Christ side (LEFT) */}
                <div className="fish-side" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={() => {
                    const hoverAudio = new Audio('/sounds/hover-bubble.mp3');
                    hoverAudio.volume = 0.5;
                    hoverAudio.play().catch(e => console.log('Hover audio failed', e));
                }}>
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
                        <form ref={formRef} id="contact-form" className="contact-form" onSubmit={handleSubmit}>
                            {/* Hidden honeypot for spam protection */}
                            <input type="hidden" name="botcheck" style={{ display: 'none' }} />
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" name="name" placeholder="Arnald " required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" placeholder="arnald@gmail.com" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" placeholder="Tell me about your project..." rows="4" required></textarea>
                            </div>

                            {/* Status messages */}
                            {status === 'sent' && (
                                <div className="form-status form-success">
                                    ✓ Message sent successfully! I'll get back to you shortly.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="form-status form-error">
                                    ✗ {errorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`btn btn-primary btn-submit ${status === 'sending' ? 'btn-loading' : ''} ${status === 'sent' ? 'btn-success' : ''} ${status === 'error' ? 'btn-error' : ''}`}
                                disabled={status === 'sending'}
                            >
                                <span>{buttonLabel[status]}</span>
                                {status === 'idle' && (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
                                    </svg>
                                )}
                                {status === 'sending' && (
                                    <span className="spinner"></span>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="social-row">
                        <a href="https://github.com/Ardcode12" className="social-pill">
                            <span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </span> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/arnald-s-381b2b336/" className="social-pill">
                            <span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </span> LinkedIn
                        </a>

                        <a href="mailto:ardcode12@gmail.com" className="social-pill">
                            <span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </span> Email
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
