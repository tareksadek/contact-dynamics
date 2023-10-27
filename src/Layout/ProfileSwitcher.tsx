import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/reducers';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { openModal } from '../store/actions/modal';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { sideMenuStyles } from './appStyles';

type ProfileSwitcherProps = {
  onCloseMenu: () => void;
};

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ onCloseMenu }) => {
  const classes = sideMenuStyles()
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const user = useSelector((state: RootState) => state.user.user);
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  
  const handleOpen = () => {
    window.history.pushState(null, "", window.location.href);
    dispatch(openModal('profileSwitcher'));
  };

  if (!appSetup?.withMultipleProfiles) {
    return null;
  }

  const goToProfile = () => {
    navigate(`/${user?.profileUrlSuffix}`);
    onCloseMenu()
  }

  return (
    <Box>
      <Typography variant="body1" align="center" onClick={goToProfile} style={{ cursor: 'pointer' }}>{profile?.title || 'Default Card'}</Typography>
      <Box mt={2} className={classes.switchButtonsContainer}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleOpen}
          startIcon={<ImportExportIcon />}
          className={classes.switchButton}
        >
          Switch Digital Card
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          disabled={appSetup.profileLimit !== undefined && appSetup.profileLimit === user?.profileList?.length}
          onClick={() => window.location.href = '/createProfile'}
          startIcon={<AddCircleIcon />}
          className={classes.switchButton}
        >
          New Digital Card
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(ProfileSwitcher);

