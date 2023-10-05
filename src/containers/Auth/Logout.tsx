import React, { useEffect } from 'react';
import { getAuth, signOut } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Successfully signed out.
        navigate('/profile');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }, [navigate]);

  return (
    <div>Logging you out...</div>
  );
}

export default Logout;
