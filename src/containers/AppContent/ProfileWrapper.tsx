import React from 'react';
import LoadingBackdrop from '../../components/Loading/LoadingBackdrop';
import useAuthenticationStatus from '../../hooks/useAuthenticationStatus';
import useUserData from '../../hooks/useUserData';

interface ProfileWrapperProps {
  children: React.ReactNode;
}

const ProfileWrapper: React.FC<ProfileWrapperProps> = ({ children }) => {
  const { loadingAuth } = useAuthenticationStatus();
  
  useUserData();    

  if (loadingAuth) {
    return <LoadingBackdrop 
      message="Authenticating..." 
      onComplete={() => true}
      cubed
    />;
  }

  return <>{children}</>;
};

export default ProfileWrapper;
