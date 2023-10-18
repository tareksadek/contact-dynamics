import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import useAuth from '../../hooks/useAuth';
import LoadingBackdrop from '../../components/Loading/LoadingBackdrop';

interface AdminProtectedWrapperProps {
  children: React.ReactElement;
}

const AdminProtectedWrapper: React.FC<AdminProtectedWrapperProps> = ({ children }) => {
  const { loadingAuth, isAdmin } = useAuth();  // <-- Use the new isAdmin state
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);

  if (loadingAuth) {
    return <LoadingBackdrop 
      message="Authenticating..."
      onComplete={() => true}
      cubed
    />
  }

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedWrapper;
