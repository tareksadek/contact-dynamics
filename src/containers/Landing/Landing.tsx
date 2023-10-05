import React, { useEffect, useState } from 'react';
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import { AppDispatch } from '../../store/reducers';
import { RootState } from '../../store/reducers';
import { fetchSetup } from '../../store/actions/setup';
import LoadingBackdrop from '../../components/Loading/LoadingBackdrop'; 

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useReduxDispatch<AppDispatch>();
  const setup = useSelector((state: RootState) => state.setup.setup);
  const loadingSetup = useSelector((state: RootState) => state.setup.loading);
  const error = useSelector((state: RootState) => state.setup.error);

  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {      
      dispatch(fetchSetup());
  }, [dispatch]);

  const handleLoadingComplete = () => {
    setIsLoadingComplete(true);
  };

  if (error) return <p>Error: {error}</p>;

  console.log(theme);
  

  if (isLoadingComplete && setup && !loadingSetup) {
    return (
      <div>
        <h1>Welcome to Our App!</h1>
        <p>{setup.withInvitations ? 'Invitations are enabled!' : 'Invitations are disabled.'}</p>
        <button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default Landing;
