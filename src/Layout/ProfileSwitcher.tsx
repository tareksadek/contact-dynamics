import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/reducers';
import { Button } from '@mui/material';
import { openModal } from '../store/actions/modal';

type ProfileSwitcherProps = {
  onCloseMenu: () => void;
};

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ onCloseMenu }) => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const user = useSelector((state: RootState) => state.user.user);
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  
  const handleOpen = () => {
    console.log("Opening ProfileSwitcher modal...");
    window.history.pushState(null, "", window.location.href);
    dispatch(openModal('profileSwitcher'));
  };

  if (!appSetup?.withMultipleProfiles) {
    return null;
  }

  return (
    <>
      <h2>{profile?.title || 'Default Profile'}</h2>
      <Button variant="outlined" onClick={handleOpen}>Switch Profile</Button>
      <Button
        variant="outlined"
        disabled={appSetup.profileLimit !== undefined && appSetup.profileLimit === user?.profileList?.length}
        onClick={() => window.location.href = '/createProfile'}
      >
        Add New Profile
      </Button>
    </>
  );
};

export default React.memo(ProfileSwitcher);

