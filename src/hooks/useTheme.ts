import { useState, useEffect } from 'react';
import { appDefaultTheme, appDefaultColor } from '../setup/setup';


type Theme = 'light' | 'dark';

interface Color {
  code: string;
  name: string;
}

const useTheme = (): {
  theme: Theme;
  color: Color;
  toggleTheme: () => void;
  setSpecificTheme: (theme: Theme) => void;
  setSpecificColor: (color: Color) => void;
} => {
  const getInitialTheme = (): Theme => {
    const savedTheme = window.localStorage.getItem('appThemePreference');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme as Theme;
    }
    
    // If system preference is available, use that.
    const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isSystemDarkMode ? 'dark' : appDefaultTheme;
  };

  const getInitialColor = (): Color => {
    const savedColor = window.localStorage.getItem('appColorPreference');
    if (savedColor) {
      try {
        const parsedColor = JSON.parse(savedColor);
        if (parsedColor && parsedColor.code && parsedColor.name) {
          return parsedColor;
        }
      } catch (error) {
        console.error("Error parsing appColorPreference:", error);
      }
    }
    return appDefaultColor; // Fallback to appDefaultColor
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [color, setColor] = useState<Color>(getInitialColor);

  useEffect(() => {
    // On theme change, update local storage
    window.localStorage.setItem('appThemePreference', theme);
    window.localStorage.setItem('appColorPreference', JSON.stringify(color));
    
    // Remove the opposite theme
    // document.body.classList.remove(theme === 'light' ? 'theme-dark' : 'theme-light');
    // // Add the current theme
    // document.body.classList.add(`theme-${theme}`);

  }, [theme, color]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setSpecificTheme = (specificTheme: Theme) => {
    console.log(theme);
    
    setTheme(specificTheme);
    console.log(theme);
    
  };

  const setSpecificColor = (specificColor: Color) => {
    setColor(specificColor);
  };

  return {
    theme,
    color,
    toggleTheme,
    setSpecificTheme,
    setSpecificColor
  };
}

export default useTheme;

