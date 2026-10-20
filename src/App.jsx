import React, { useState, useEffect } from 'react';
import { UnderwaterBackground } from './components/UnderwaterBackground';
import { Persona3Menu } from './components/Persona3Menu';

export function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('portfolio_theme', 'dark');
  }, []);

  return (
    <div
      className="portfolio-app persona3-theme-container"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        background: '#040b22',
      }}
    >
      {/* Animated Persona 3 Underwater Caustic & Light Ray Background */}
      <UnderwaterBackground />

      {/* Main Persona 3 Reload Interactive Game Menu */}
      <Persona3Menu />
    </div>
  );
}

export default App;

