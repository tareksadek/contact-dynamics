import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import { setUser, clearUser } from '../store/actions/authUser';
import { fetchUser } from '../store/actions/user';
import { fetchSetup } from '../store/actions/setup';
import { AppDispatch } from '../store/reducers';
import { RootState } from '../store/reducers';

const useAuth = () => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 
  const setup = useSelector((state: RootState) => state.setup.setup);
  const loadingSetup = useSelector((state: RootState) => state.setup.loading);
  const userId = useSelector((state: RootState) => state.authUser.userId);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();  

  useEffect(() => {
    const auth = getAuth();
  
    const handleAuthChange = async (user: User | null) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin);
        dispatch(setUser(user.uid));
      } else {
        setIsAdmin(false);
        dispatch(clearUser());
      }
      setLoadingAuth(false);
    };
  
    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
  
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (userId && isLoggedIn && !currentUser) {
      dispatch(fetchUser(userId));
    }
  }, [dispatch, isLoggedIn, currentUser, userId]);

  console.log(currentUser);
  

  useEffect(() => {
    if (!setup && !loadingSetup) {
      dispatch(fetchSetup());
    }
  }, [dispatch, setup, loadingSetup]);


  return { loadingAuth, isAdmin };
};

export default useAuth;
