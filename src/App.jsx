import React, { useState, useCallback, lazy, Suspense } from 'react';
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