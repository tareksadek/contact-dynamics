import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConnectivityProviderProps {
  children: ReactNode;
}

const ConnectivityContext = createContext<boolean | undefined>(undefined);

export const useConnectivity = () => {
  const context = useContext(ConnectivityContext);
  if (context === undefined) {
    throw new Error("useConnectivity must be used within a ConnectivityProvider");
  }
  return context;
};

export const ConnectivityProvider: React.FC<ConnectivityProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Frontend-based detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Backend-based detection
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
  
    const checkConnectivity = async () => {
      try {
        const response = await fetch('https://api.ipify.org');
        if (response.status === 200) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        setIsOnline(false);
      }
    };
  
    if (navigator.onLine) {
      checkConnectivity();
      interval = setInterval(checkConnectivity, 10000); // Check every 10 seconds, adjust as needed
    } else {
      setIsOnline(false);
    }
  
    window.addEventListener('online', checkConnectivity);
    window.addEventListener('offline', () => setIsOnline(false));
  
    return () => {
      window.removeEventListener('online', checkConnectivity);
      window.removeEventListener('offline', () => setIsOnline(false));
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <ConnectivityContext.Provider value={isOnline}>
      {children}
    </ConnectivityContext.Provider>
  );
};
