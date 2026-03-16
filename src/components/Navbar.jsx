import React, { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '🌊' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'contact', label: 'Contact', icon: '📬' },
];

function Navbar() {
    const [activeSection, setActiveSection] = useState('hero');
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const lastScrollY = useRef(0);

    // Show/hide on scroll direction + glass effect after scroll
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const currentY = window.scrollY;
                setScrolled(currentY > 50);
                setHidden(currentY > lastScrollY.current && currentY > 200);
                lastScrollY.current = currentY;
                ticking = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Active section detection via IntersectionObserver
    useEffect(() => {
        const sections = NAV_LINKS.map(l => document.getElementById(l.id)).filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );

        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setMobileOpen(false);
        }
    };

    return (
        <>
            <nav className={`nav ${scrolled ? 'nav--scrolled' : ''} ${hidden ? 'nav--hidden' : ''}`}>
                <div className="nav__inner">
                    {/* Logo */}
                    <button className="nav__logo" onClick={() => scrollTo('hero')}>
                        <span className="nav__logo-text">
                            Arnald<span className="nav__logo-accent">.dev</span>
                        </span>
                    </button>

                    {/* Desktop links — centered */}
                    <ul className="nav__links">
                        {NAV_LINKS.map((link) => (
                            <li key={link.id}>
                                <button
                                    className={`nav__link ${activeSection === link.id ? 'nav__link--active' : ''}`}
                                    onClick={() => scrollTo(link.id)}
                                >
                                    {link.label}
                                    <span className="nav__link-indicator" />
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* CTA button — desktop only */}
                    <button className="nav__cta" onClick={() => scrollTo('contact')}>
                        Let's Talk
                    </button>

                    {/* Mobile hamburger */}
                    <button
                        className={`nav__burger ${mobileOpen ? 'nav__burger--open' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </nav>

            {/* Mobile fullscreen overlay */}
            <div className={`nav__mobile ${mobileOpen ? 'nav__mobile--open' : ''}`}>
                <div className="nav__mobile-backdrop" onClick={() => setMobileOpen(false)} />
                <div className="nav__mobile-content">
                    {/* Mobile logo */}
                    <div className="nav__mobile-header">
                        <span className="nav__logo-text">
                            Arnald<span className="nav__logo-accent">.dev</span>
                        </span>
                    </div>

                    {/* Mobile links */}
                    <ul className="nav__mobile-links">
                        {NAV_LINKS.map((link, i) => (
                            <li key={link.id} style={{ animationDelay: `${0.05 + i * 0.05}s` }}>
                                <button
                                    className={`nav__mobile-link ${activeSection === link.id ? 'nav__mobile-link--active' : ''}`}
                                    onClick={() => scrollTo(link.id)}
                                >
                                    <span className="nav__mobile-link-icon">{link.icon}</span>
                                    <span className="nav__mobile-link-label">{link.label}</span>
                                    {activeSection === link.id && (
                                        <span className="nav__mobile-link-dot" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile CTA */}
                    <button className="nav__mobile-cta" onClick={() => scrollTo('contact')}>
                        Let's Talk ↗
                    </button>

                    {/* Decorative bubbles */}
                    <div className="nav__mobile-bubbles">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="nav__mobile-bubble"
                                style={{
                                    '--x': `${15 + Math.random() * 70}%`,
                                    '--size': `${6 + Math.random() * 12}px`,
                                    '--delay': `${i * 0.8}s`,
                                    '--duration': `${6 + Math.random() * 6}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
