import React from 'react';
import ErrorBoundary from './hoc/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import AppContent from './containers/AppContent/AppContent';
import { CssBaseline } from '@mui/material';

const App: React.FC = () => {  
  return (
    <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
      <ThemeProvider>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
