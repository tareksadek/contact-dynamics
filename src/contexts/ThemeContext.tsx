import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { appDefaultTheme, appDefaultColor } from '../setup/setup';
import { lightTheme, darkTheme } from '../theme/main';

type Theme = 'light' | 'dark';

interface Color {
  code: string;
  name: string;
}

interface ThemeContextProps {
  theme: Theme;
  color: Color;
  toggleTheme: () => void;
  setSpecificTheme: (theme: Theme) => void;
  setSpecificColor: (color: Color) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
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
    
    // Remove the opposite theme (if you want to update body class names)
    document.body.classList.remove(theme === 'light' ? 'theme-dark' : 'theme-light');
    // Add the current theme
    document.body.classList.add(`theme-${theme}`);

  }, [theme, color]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setSpecificTheme = (specificTheme: Theme) => {
    setTheme(specificTheme);
  };

  const setSpecificColor = (specificColor: Color) => {
    setColor(specificColor);
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, color, toggleTheme, setSpecificTheme, setSpecificColor }}>
      <MUIThemeProvider theme={currentTheme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
