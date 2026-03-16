import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import all styles
import './styles/global.css';
import './styles/navbar.css';
import './styles/loader.css';
import './styles/ocean-background.css';
import './styles/underwater-fx.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/skills.css';
import './styles/projects.css';
import './styles/achievements.css';   // ★ ADD THIS
import './styles/contact.css';
import './styles/footer.css';
import './styles/responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);