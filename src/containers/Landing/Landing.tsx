import React, { useEffect } from 'react';
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/actions/types';
import { RootState } from '../../store/reducers';
import { fetchSetup } from '../../store/actions/setup';
import { log } from 'console';

const Landing: React.FC = () => {
    const dispatch = useReduxDispatch<AppDispatch>();
    const setup = useSelector((state: RootState) => state.setup.setup);
    const loading = useSelector((state: RootState) => state.setup.loading);
    const error = useSelector((state: RootState) => state.setup.error);


    useEffect(() => {
      console.log('xxx');
      
        dispatch(fetchSetup());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Welcome to Our App!</h1>
            {/* Render any setup data or other components here */}
            <p>{setup?.withInvitations ? 'Invitations are enabled!' : 'Invitations are disabled.'}</p>
        </div>
    );
};

export default Landing;
