import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import { setUser, clearUser } from '../store/actions/authUser';
import { AppDispatch } from '../store/reducers';
import { RootState } from '../store/reducers';

const useAuthenticationStatus = () => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const userId = useSelector((state: RootState) => state.authUser.userId);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const auth = getAuth();

    const handleAuthChange = (user: User | null) => {
      if (user) {
        dispatch(setUser(user.uid));
      } else {
        dispatch(clearUser());
      }
      setLoadingAuth(false);
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);

    // Cleanup
    return () => unsubscribe();
  }, [dispatch]);

  return { loadingAuth, isLoggedIn: Boolean(userId) };
};

export default useAuthenticationStatus;
