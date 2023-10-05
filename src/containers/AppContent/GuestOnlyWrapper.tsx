import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import useAuth from '../../hooks/useAuth';

interface GuestOnlyWrapperProps {
  children: React.ReactElement;
  redirectTo?: string;
}

const GuestOnlyWrapper: React.FC<GuestOnlyWrapperProps> = ({ children, redirectTo = "/profile" }) => {
  const { loadingAuth } = useAuth();
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);

  if (loadingAuth) {
    return null
  }

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default GuestOnlyWrapper;
