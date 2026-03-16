import React, { useEffect, useState, useRef } from 'react';

// ╔═══════════════════════════════════════════════════════════════╗
// ║  All GLB models to preload during the loading screen          ║
// ╚═══════════════════════════════════════════════════════════════╝
const ASSETS_TO_PRELOAD = [
    '/glb_files/main_fish.glb',
    '/glb_files/nanando_diver_-_underwater.glb',
    '/glb_files/turtle.glb',
    '/glb_files/model_65a_-_longnose_gar.glb',
    '/glb_files/white_pointer.glb',
    '/glb_files/blue_whale_-_textured.glb',
    '/glb_files/guppie_animated.glb',
    '/glb_files/octo.glb',
];

const LOADING_TIPS = [
    'Loading 3D models...',
    'Preparing underwater world...',
    'Rendering ocean depths...',
    'Waking the sea creatures...',
    'Almost there...',
];

function Loader({ onLoaded }) {
    const [progress, setProgress] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const bubblesRef = useRef(null);

    // Cycle tips
    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Generate bubbles
    useEffect(() => {
        if (!bubblesRef.current) return;
        const container = bubblesRef.current;
        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'loader-bubble';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.width = bubble.style.height = (Math.random() * 12 + 4) + 'px';
            bubble.style.animationDuration = (Math.random() * 4 + 3) + 's';
            bubble.style.animationDelay = (Math.random() * 5) + 's';
            bubble.style.opacity = Math.random() * 0.4 + 0.1;
            container.appendChild(bubble);
        }
    }, []);

    // Preload all assets
    useEffect(() => {
        let loaded = 0;
        const total = ASSETS_TO_PRELOAD.length;

        const loadAsset = (url) => {
            return fetch(url)
                .then((res) => {
                    if (!res.ok) throw new Error(`Failed to load ${url}`);
                    return res.arrayBuffer();
                })
                .then(() => {
                    loaded++;
                    setProgress(Math.round((loaded / total) * 100));
                })
                .catch((err) => {
                    console.warn('⚠️ Preload failed:', url, err);
                    loaded++;
                    setProgress(Math.round((loaded / total) * 100));
                });
        };

        Promise.all(ASSETS_TO_PRELOAD.map(loadAsset)).then(() => {
            // Minimum display time of 2s for branding, then fade out
            setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                    if (onLoaded) onLoaded();
                }, 1000); // match CSS fade-out duration
            }, 800);
        });
    }, [onLoaded]);

    return (
        <div id="loader" className={fadeOut ? 'hidden' : ''}>
            {/* Animated bubbles background */}
            <div className="loader-bubbles" ref={bubblesRef} />

            {/* Depth light rays */}
            <div className="loader-rays">
                <div className="loader-ray" />
                <div className="loader-ray" />
                <div className="loader-ray" />
            </div>

            <div className="loader-content">
                {/* Animated ocean icon */}
                <div className="loader-logo-wrap">
                    <div className="loader-ripple" />
                    <div className="loader-ripple loader-ripple-2" />
                    <div className="loader-icon-main">🌊</div>
                </div>

                {/* Title */}
                <h2 className="loader-title">
                    <span className="loader-title-ocean">Ocean</span>
                    <span className="loader-title-port">Port</span>
                </h2>

                {/* Progress bar */}
                <div className="loader-progress-wrap">
                    <div className="loader-progress-track">
                        <div
                            className="loader-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                        <div
                            className="loader-progress-glow"
                            style={{ left: `${progress}%` }}
                        />
                    </div>
                    <div className="loader-progress-info">
                        <span className="loader-tip">{LOADING_TIPS[tipIndex]}</span>
                        <span className="loader-pct">{progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loader;
