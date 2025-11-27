import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#0a0a0a' : '#f8fffe';
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? {
      // DARK MODE - Everything Dark
      background: '#0a0a0a',
      backgroundGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      surface: 'rgba(20, 20, 20, 0.9)',
      surfaceHover: 'rgba(40, 40, 40, 0.9)',
      panel: 'linear-gradient(135deg, rgba(15, 15, 15, 0.9), rgba(25, 25, 25, 0.8))',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      textMuted: 'rgba(255, 255, 255, 0.5)',
      accent: '#00ff88',
      accentDark: '#00cc66',
      border: 'rgba(255, 255, 255, 0.1)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      input: 'rgba(30, 30, 30, 0.8)',
      inputBorder: 'rgba(255, 255, 255, 0.2)',
      shadow: 'rgba(0, 0, 0, 0.8)',
      overlay: 'rgba(0, 0, 0, 0.9)',
      navBg: '#1a1a1a',
      chatBg: 'linear-gradient(135deg, rgba(15, 15, 15, 0.9), rgba(25, 25, 25, 0.8))',
      heroBg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
    } : {
      // LIGHT MODE - Everything Light  
      background: '#f8fffe',
      backgroundGradient: 'linear-gradient(135deg, #f8fffe 0%, #e6fffa 50%, #f0fff0 100%)',
      surface: 'rgba(255, 255, 255, 0.9)',
      surfaceHover: 'rgba(255, 255, 255, 0.95)',
      panel: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 255, 245, 0.8))',
      text: '#2d5a3d',
      textSecondary: '#5a7a6a',
      textMuted: '#8a9a8a',
      accent: '#00cc66',
      accentDark: '#00aa55',
      border: 'rgba(100, 200, 150, 0.3)',
      borderLight: 'rgba(100, 200, 150, 0.2)',
      input: 'rgba(255, 255, 255, 0.8)',
      inputBorder: 'rgba(100, 200, 150, 0.3)',
      shadow: 'rgba(100, 200, 150, 0.2)',
      overlay: 'rgba(255, 255, 255, 0.9)',
      navBg: '#2d5a3d',
      chatBg: 'linear-gradient(135deg, rgba(10, 25, 15, 0.8), rgba(22, 62, 42, 0.6))',
      heroBg: 'linear-gradient(135deg, #f8fffe 0%, #e6fffa 50%, #f0fff0 100%)'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};