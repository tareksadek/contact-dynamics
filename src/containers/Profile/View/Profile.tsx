import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/reducers';
import { RootState } from '../../../store/reducers';
import { fetchUserByProfileSuffix } from '../../../store/actions/user'; 
import DefaultLayout from '../../../components/Profile/View/Default/Layout';
import BusinessLayout from '../../../components/Profile/View/Business/Layout';
import SocialLayout from '../../../components/Profile/View/Social/Layout';
import CardLayout from '../../../components/Profile/View/Card/Layout';
import { logProfileVisit } from '../../../API/profile';

const Profile: React.FC = () => {
  const { profileSuffix } = useParams<{ profileSuffix: string }>();

  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn); 
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const isAccountOwner = isLoggedIn && (authId === user?.id)

  const dispatch = useReduxDispatch<AppDispatch>();

  const shouldLogVisit = (profileId: string): boolean => {
    const lastVisit = localStorage.getItem(`visited_${profileId}`);
    if (lastVisit) {
      const ONE_DAY = 24 * 60 * 60 * 1000; // in ms
      const now = Date.now();
      if ((now - Number(lastVisit)) < ONE_DAY) {
        return false;
      }
    }
    return true;
  };

  const markProfileAsVisited = (profileId: string) => {
    localStorage.setItem(`visited_${profileId}`, Date.now().toString());
  };

  useEffect(() => {
    if (profileSuffix && !user && !isLoggedIn) {      
      dispatch(fetchUserByProfileSuffix(profileSuffix));
    }
  }, [profileSuffix, dispatch, user, isLoggedIn]);

  useEffect(() => {
    if ((!isLoggedIn || !isAccountOwner) && user && profile && profile.id && shouldLogVisit(profile.id)) {
      logProfileVisit(user.id, profile.id);
      markProfileAsVisited(profile.id);
    }
  }, [user, profile, isLoggedIn, isAccountOwner]);

  if (!profile) {
    return <div>No profile data available</div>;
  }  

  switch (profile.themeSettings.layout) {
    case 'business':
      return <BusinessLayout profile={profile} />;
    case 'social':
      return <SocialLayout profile={profile} />;
    case 'card':
      return <CardLayout profile={profile} />;
    default:
      return <DefaultLayout profile={profile} />;
  }
}

export default Profile;
