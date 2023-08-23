import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../API/firebaseConfig';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div>Profile page</div>
  );
};

export default ProfilePage;
