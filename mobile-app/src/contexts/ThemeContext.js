import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? {
      // Dark Mode
      background: '#0a0a0a',
      surface: 'rgba(40, 40, 40, 0.9)',
      surfaceHover: 'rgba(60, 60, 60, 0.9)',
      panel: '#1a1a1a',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      textMuted: 'rgba(255, 255, 255, 0.5)',
      accent: '#00ff88',
      accentDark: '#00cc66',
      border: 'rgba(255, 255, 255, 0.1)',
      input: 'rgba(40, 40, 40, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.8)'
    } : {
      // Light Mode
      background: '#f8fffe',
      surface: 'rgba(255, 255, 255, 0.9)',
      surfaceHover: 'rgba(255, 255, 255, 0.95)',
      panel: '#ffffff',
      text: '#2d5a3d',
      textSecondary: '#5a7a6a',
      textMuted: '#8a9a8a',
      accent: '#00cc66',
      accentDark: '#00aa55',
      border: 'rgba(100, 200, 150, 0.3)',
      input: 'rgba(255, 255, 255, 0.8)',
      shadow: 'rgba(100, 200, 150, 0.2)'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};