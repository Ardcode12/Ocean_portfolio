import React, { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import OceanBackground from './components/OceanBackground';
import UnderwaterFX from './components/UnderwaterFX';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import useScrollAnimations from './hooks/useScrollAnimations';

const OceanCanvas = lazy(() => import('./components/OceanCanvas'));
const Projects = lazy(() => import('./components/Projects'));

function App() {
    const [loading, setLoading] = useState(true);

    const handleLoaded = useCallback(() => {
        setLoading(false);
    }, []);

    useScrollAnimations(loading);

    const bgAudioRef = React.useRef(null);
    const loaderAudioRef = React.useRef(null);
    const swimAudioRef = React.useRef(null);
    
    // UI Interaction Sounds Refs
    const hoverAudioRef = React.useRef(null);
    const clickAudioRef = React.useRef(null);

    const hasStartedRef = React.useRef(false);
    const swimTimeoutRef = React.useRef(null);

    const fadeOutAudio = (audio, duration = 500) => {
        if (!audio) return;
        const startVolume = audio.volume;
        const startTime = performance.now();

        const step = (time) => {
            const elapsed = time - startTime;
            const t = Math.min(elapsed / duration, 1);
            audio.volume = startVolume * (1 - t);
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = startVolume;
            }
        };

        requestAnimationFrame(step);
    };

    // Setup audio once and start on first user interaction
    useEffect(() => {
        // Background loop sounds
        bgAudioRef.current = new Audio('/sounds/loading_screen_and_bg_sound.wav');
        bgAudioRef.current.loop = true;
        bgAudioRef.current.volume = 0.09;

        loaderAudioRef.current = new Audio('/sounds/loading_screen_and_bg_sound.wav');
        loaderAudioRef.current.loop = true;
        loaderAudioRef.current.volume = 0.009;

        swimAudioRef.current = new Audio('/sounds/On_scroll_fish_sound.mp3');
        swimAudioRef.current.loop = true;
        swimAudioRef.current.volume = 0.1;

        // UI Interaction Sounds (Pre-loaded)
        hoverAudioRef.current = new Audio('/sounds/sonar_click.wav');
        hoverAudioRef.current.volume = 0.2;
        
        clickAudioRef.current = new Audio('/sounds/bubble_hover.wav');
        clickAudioRef.current.volume = 0.3;

        const startAudio = () => {
            if (hasStartedRef.current) return;
            hasStartedRef.current = true;
            bgAudioRef.current.play().catch(() => null);
            swimAudioRef.current.play().catch(() => null);
            if (loading) {
                loaderAudioRef.current.play().catch(() => null);
            }
        };

        const handleInteraction = () => startAudio();

        const handleScroll = () => {
            if (!hasStartedRef.current || !swimAudioRef.current) return;
            
            swimAudioRef.current.volume = 0.2;
            
            if (swimTimeoutRef.current) clearTimeout(swimTimeoutRef.current);
            swimTimeoutRef.current = setTimeout(() => {
                if (swimAudioRef.current) swimAudioRef.current.volume = 0.1;
            }, 1000);
        };

        // UI Events Listener Function
        const isInteractive = (el) => {
            return (
                el.tagName === 'A' ||
                el.tagName === 'BUTTON' ||
                el.closest('a') !== null ||
                el.closest('button') !== null ||
                el.closest('.project-card') !== null || // Special cases like project cards
                el.classList.contains('button') ||
                el.getAttribute('role') === 'button'
            );
        };

        const handleUIHover = (e) => {
            if (!hasStartedRef.current) return;
            if (isInteractive(e.target)) {
                if (hoverAudioRef.current) {
                    // Clone the audio node so overlapping rapid hovers successfully play sound independently
                    const hoverClone = hoverAudioRef.current.cloneNode();
                    hoverClone.volume = hoverAudioRef.current.volume;
                    hoverClone.play().catch(() => null);
                    // Force the audio to stop after 1 second (1000ms)
                    setTimeout(() => {
                        hoverClone.pause();
                        hoverClone.currentTime = 0;
                    }, 1000);
                }
            }
        };

        // ── Web Audio API for precise 0.5s bubble click ──
        let clickAudioCtx = null;
        let clickBuffer = null;

        try {
            clickAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            fetch('/sounds/bubble_hover.wav')
                .then(res => res.arrayBuffer())
                .then(data => clickAudioCtx.decodeAudioData(data))
                .then(buffer => { clickBuffer = buffer; })
                .catch(() => null);
        } catch (e) {
            console.log('Web Audio API not available, falling back');
        }

        const handleUIClick = (e) => {
            if (!hasStartedRef.current) return;
            if (isInteractive(e.target)) {
                if (clickBuffer && clickAudioCtx) {
                    const source = clickAudioCtx.createBufferSource();
                    source.buffer = clickBuffer;
                    const gainNode = clickAudioCtx.createGain();
                    gainNode.gain.value = 0.2;
                    source.connect(gainNode);
                    gainNode.connect(clickAudioCtx.destination);
                    source.start(0);
                    // Precise hardware-level stop at exactly 0.5 seconds
                    source.stop(clickAudioCtx.currentTime + 0.5);
                }
            }
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('scroll', handleInteraction);
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('keydown', handleInteraction);
        
        // UI Sound Listeners
        document.addEventListener('mouseover', handleUIHover);
        document.addEventListener('mousedown', handleUIClick); // Use mousedown for immediate response

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('keydown', handleInteraction);
            document.removeEventListener('mouseover', handleUIHover);
            document.removeEventListener('mousedown', handleUIClick);
            
            bgAudioRef.current?.pause();
            loaderAudioRef.current?.pause();
            swimAudioRef.current?.pause();
            if (swimTimeoutRef.current) clearTimeout(swimTimeoutRef.current);
            if (clickAudioCtx) clickAudioCtx.close().catch(() => null);
        };
    }, []);

    // Fade out loader sound when page finishes loading
    useEffect(() => {
        if (!hasStartedRef.current) return;
        if (!loading) {
            fadeOutAudio(loaderAudioRef.current, 600);
        } else {
            loaderAudioRef.current?.play().catch(() => null);
        }
    }, [loading]);

    return (
        <>
            {loading && <Loader onLoaded={handleLoaded} />}
            {!loading && <Navbar />}
            <OceanBackground />
            <UnderwaterFX />
            <Suspense fallback={<div></div>}>
                <OceanCanvas />
            </Suspense>
            <div id="scroll-container">
                <Hero />
                <About />
                <Skills />
                <Suspense fallback={<div>Loading projects...</div>}>
                    <Projects />
                </Suspense>
                <Achievements />   {/* ★ ADD THIS */}
                <Contact />
            </div>
        </>
    );
}

export default App;