import React from 'react';

function OceanBackground() {
    return (
        <div id="ocean-bg">
            <video id="ocean-video" autoPlay muted loop playsInline>
                <source src="/glb_files/best.mp4" type="video/mp4" />
            </video>
            <div className="ocean-overlay"></div>
            <div className="ocean-gradient-top"></div>
            <div className="ocean-gradient-bottom"></div>
        </div>
    );
}

export default OceanBackground;
