import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/styles.css';
import './styles/theme.css';
import './styles/resume-pages.css';
import './styles/neone-theme.css';
import './styles/landing-redesign.css';
import './styles/auth-redesign.css';
import './styles/cosmic-pages.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
