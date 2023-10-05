import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/actions/user';
import { fetchSetup } from '../store/actions/setup';
import { AppDispatch } from '../store/reducers';
import { RootState } from '../store/reducers';

const useUserData = () => {
  const userId = useSelector((state: RootState) => state.authUser.userId);
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const loadingSetup = useSelector((state: RootState) => state.setup.loading);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  const isUserDataLoaded = isLoggedIn && currentUser && currentUser.id
  const isAccountOwner = currentUser && isLoggedIn && userId && userId === currentUser.id

  const [setupFetched, setSetupFetched] = useState(false);

  useEffect(() => {
    if (userId && (!isUserDataLoaded || !isAccountOwner)) {
      dispatch(fetchUser(userId));
    }
  }, [userId, dispatch, isUserDataLoaded, isAccountOwner]);
  
  useEffect(() => {
    if (!setupFetched && ((!appSetup && !loadingSetup) || (appSetup && !isAccountOwner && !loadingSetup))) {
      dispatch(fetchSetup());
      setSetupFetched(true)
    }
  }, [dispatch, appSetup, isAccountOwner, loadingSetup, currentUser, setupFetched]);
};

export default useUserData;
