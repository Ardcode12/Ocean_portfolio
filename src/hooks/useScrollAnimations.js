import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations(loading) {
    useEffect(() => {
        if (loading) return;

        const raf = requestAnimationFrame(() => {
            setupHeroAnimation();
            setupHeroParallax();
            setupSectionAnimations();
            setupGlobalParallax();
        });

        return () => {
            cancelAnimationFrame(raf);
        };
    }, [loading]);
}

// ═══════════════════════════════════════════
//  HERO — Staggered entrance + scroll parallax fade
// ═══════════════════════════════════════════
function setupHeroAnimation() {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
    });
    tl.to('.line-1', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
    }, '-=0.35');
    tl.to('.line-2', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
    }, '-=0.35');
    tl.to('.line-3', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
    }, '-=0.35');
    tl.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
    }, '-=0.25');
    tl.to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
    }, '-=0.2');
    tl.to('.scroll-indicator', {
        opacity: 0.7,
        duration: 0.8,
    }, '-=0.2');
}

function setupHeroParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Hero content fades + drifts up as user scrolls past
    gsap.to('.hero-content', {
        y: -80,
        opacity: 0,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
    });

    // Scroll indicator fades quickly
    gsap.to('.scroll-indicator', {
        opacity: 0,
        y: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: hero,
            start: '15% top',
            end: '35% top',
            scrub: true,
        },
    });
}

// ═══════════════════════════════════════════
//  GLOBAL — Subtle parallax on backgrounds
// ═══════════════════════════════════════════
function setupGlobalParallax() {
    // Ocean background parallax depth
    gsap.to('.ocean-bg', {
        y: 100,
        ease: 'none',
        scrollTrigger: {
            trigger: '#scroll-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 3,
        },
    });

    // Section separators shimmer with scroll
    document.querySelectorAll('.section::after').forEach((sep) => {
        gsap.fromTo(
            sep,
            { opacity: 0 },
            {
                opacity: 1,
                scrollTrigger: {
                    trigger: sep,
                    start: 'top 90%',
                    end: 'top 60%',
                    scrub: true,
                },
            }
        );
    });
}

// ═══════════════════════════════════════════
//  SECTION ANIMATIONS — Per-section polish
// ═══════════════════════════════════════════
function setupSectionAnimations() {
    ['about', 'skills', 'projects', 'contact'].forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const label = section.querySelector('.section-label');
        const title = section.querySelector('.section-title');

        // ── Section header: blur-fade entrance ──
        const headerTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
            },
        });

        if (label) {
            headerTl.fromTo(
                label,
                { opacity: 0, x: -30, filter: 'blur(6px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' },
                0
            );
        }

        if (title) {
            headerTl.fromTo(
                title,
                { opacity: 0, x: -30, filter: 'blur(6px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
                0.12
            );
        }

        // ════════════════════════════════
        //  ABOUT — Enhanced
        // ════════════════════════════════
        if (id === 'about') {
            // Card 3D tilt entrance
            gsap.fromTo(
                '.about-card',
                { opacity: 0, y: 40, rotateX: 5, filter: 'blur(4px)' },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: section, start: 'top 60%' },
                }
            );

            // Stats row staggered entrance
            gsap.fromTo(
                '.stats-row',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: section, start: 'top 50%' },
                }
            );

            // Stat items stagger with elastic pop
            gsap.fromTo(
                '.stat-item',
                { opacity: 0, y: 20, scale: 0.85 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.5)',
                    scrollTrigger: { trigger: '.stats-row', start: 'top 80%' },
                }
            );

            // Counting animation
            ScrollTrigger.create({
                trigger: section,
                start: 'top 55%',
                once: true,
                onEnter: () => {
                    document.querySelectorAll('.stat-number').forEach((el) => {
                        gsap.to(el, {
                            innerText: parseInt(el.dataset.count),
                            duration: 2,
                            snap: { innerText: 1 },
                            ease: 'power2.out',
                            onUpdate() {
                                el.textContent = Math.round(parseFloat(el.textContent));
                            },
                        });
                    });
                },
            });

            // Parallax drift on about card
            gsap.to('.about-card', {
                y: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                },
            });
        }

        // ════════════════════════════════
        //  SKILLS — Enhanced
        // ════════════════════════════════
        if (id === 'skills') {
            // Skill orbs: wave reveal with stagger
            gsap.fromTo(
                '.skill-orb-positioned',
                { opacity: 0, scale: 0.3, rotate: -15 },
                {
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    stagger: {
                        each: 0.07,
                        from: 'center',
                    },
                    ease: 'elastic.out(1, 0.6)',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 55%',
                    },
                }
            );

            // Center gap elastic entrance
            gsap.fromTo(
                '.circle-center-gap',
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: 'elastic.out(1, 0.4)',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 55%',
                    },
                }
            );

            // Orbit ring scale-in
            gsap.fromTo(
                '.orbit-ring',
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 60%',
                    },
                }
            );

            // Depth tabs slide in
            gsap.fromTo(
                '.depth-tab',
                { y: 25, opacity: 0, filter: 'blur(4px)' },
                {
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 65%',
                    },
                }
            );

            // Gentle continuous rotation on orbit
            gsap.to('.orbit-ring', {
                rotate: 360,
                duration: 60,
                ease: 'none',
                repeat: -1,
            });
        }

        // ════════════════════════════════
        //  PROJECTS — Enhanced
        // ════════════════════════════════
        if (id === 'projects') {
            // Header blur-fade (override)
            gsap.fromTo(
                '.projects-section .section-label',
                { opacity: 0, y: 30, filter: 'blur(6px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 70%',
                    },
                }
            );
            gsap.fromTo(
                '.projects-section .section-title',
                { opacity: 0, y: 30, filter: 'blur(6px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    delay: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 70%',
                    },
                }
            );

            // Project cards — staggered 3D entrance
            const projectCards = section.querySelectorAll('.project-card, .bento-item');
            projectCards.forEach((card, i) => {
                gsap.fromTo(
                    card,
                    {
                        opacity: 0,
                        y: 50,
                        rotateX: 4,
                        scale: 0.94,
                        filter: 'blur(4px)',
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 0.7,
                        delay: i * 0.08,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                        },
                    }
                );

                // Parallax drift
                gsap.to(card, {
                    y: -15 + (i % 4) * 5,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2,
                    },
                });
            });
        }

        // ════════════════════════════════
        //  CONTACT — Enhanced
        // ════════════════════════════════
        if (id === 'contact') {
            // Contact card: glass card 3D entrance
            gsap.fromTo(
                '.contact-card',
                { opacity: 0, y: 40, rotateX: 4, filter: 'blur(4px)' },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: section, start: 'top 60%' },
                }
            );

            // Social pills: staggered bounce entrance
            gsap.fromTo(
                '.social-pill',
                { opacity: 0, y: 25, scale: 0.85 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.4)',
                    scrollTrigger: { trigger: '.social-row', start: 'top 85%' },
                }
            );

            // Social row fade
            gsap.fromTo(
                '.social-row',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: section, start: 'top 50%' },
                }
            );

            // Form inputs: floating label focus effects via GSAP
            const inputs = section.querySelectorAll('input, textarea');
            inputs.forEach((input) => {
                input.addEventListener('focus', () => {
                    gsap.to(input, {
                        borderColor: 'rgba(0, 229, 255, 0.4)',
                        boxShadow: '0 0 20px rgba(0, 229, 255, 0.1)',
                        duration: 0.3,
                    });
                });
                input.addEventListener('blur', () => {
                    gsap.to(input, {
                        borderColor: 'rgba(0, 229, 255, 0.12)',
                        boxShadow: 'none',
                        duration: 0.3,
                    });
                });
            });

            // Contact card parallax
            gsap.to('.contact-card', {
                y: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                },
            });
        }
    });
}