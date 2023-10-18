import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import useAuth from '../../hooks/useAuth';
import LoadingBackdrop from '../../components/Loading/LoadingBackdrop';

interface ProtectedWrapperProps {
  children: React.ReactElement;
}

const ProtectedWrapper: React.FC<ProtectedWrapperProps> = ({ children }) => {
  const { loadingAuth } = useAuth();
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();

  if (loadingAuth) {
    return <LoadingBackdrop 
      message="Authenticating..."
      onComplete={() => true}
      cubed
    />
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === "/theme" && appSetup?.themeSettings) {
    return <Navigate to={`/${user?.profileUrlSuffix}`} replace />;
  }

  if (location.pathname === "/redirect" && appSetup?.redirect) {
    return <Navigate to={`/${user?.profileUrlSuffix}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedWrapper;
