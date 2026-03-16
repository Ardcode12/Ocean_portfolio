import React, { useState, useCallback } from 'react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import OceanBackground from './components/OceanBackground';
import UnderwaterFX from './components/UnderwaterFX';
import OceanCanvas from './components/OceanCanvas';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import useScrollAnimations from './hooks/useScrollAnimations';

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
            <OceanCanvas />
            <div id="scroll-container">
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Achievements />   {/* ★ ADD THIS */}
                <Contact />
            </div>
        </>
    );
}

export default App;