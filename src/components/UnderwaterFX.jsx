import React from 'react';

function UnderwaterFX() {
    const bubbles = Array.from({ length: 12 }, (_, i) => (
        <div key={`bubble-${i + 1}`} className={`bubble bubble-${i + 1}`}></div>
    ));

    const particles = Array.from({ length: 8 }, (_, i) => (
        <div key={`particle-${i + 1}`} className={`particle particle-${i + 1}`}></div>
    ));

    return (
        <div id="underwater-fx">
            {bubbles}
            <div className="caustic-light"></div>
            {particles}
        </div>
    );
}

export default UnderwaterFX;
