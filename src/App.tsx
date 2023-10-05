import React from 'react';
import ErrorBoundary from './hoc/ErrorBoundary';
import AppThemeProvider from './providers/AppThemeProvider';
import AppContent from './containers/AppContent/AppContent';

const App: React.FC = () => {  
  return (
    <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
      <AppThemeProvider>
        <AppContent />
      </AppThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
