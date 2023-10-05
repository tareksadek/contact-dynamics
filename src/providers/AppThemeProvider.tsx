import React, { ReactNode } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import useTheme from '../hooks/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

const AppThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useTheme();  
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default AppThemeProvider;