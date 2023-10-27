import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/reducers';
import { Dialog, DialogContent, Button, Box, Typography } from '@mui/material';
import { switchProfile } from '../store/actions/profile';
import { closeMenu } from '../store/actions/modal';

const ProfileSwitcherDialog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);

  const isOpen = openModalName === 'profileSwitcher';

  const handleClose = useCallback(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  const switchActiveProfile = (profileId: string) => {
    if (user && user.id) {
      dispatch(switchProfile(user.id, profileId));
    }
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="switch-profile-modal-title"
      maxWidth={false}
    >
      <DialogContent>
        <Typography variant="body1" align="center">Select a Profile</Typography>
        <Box maxWidth={550} margin="auto" width="100%">
          <Box>
            {user?.profileList?.map((p) => (
              <Box key={p.profileId} mt={1} mb={1} width="100%" minWidth={250}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={p.profileId === user?.activeProfileId}
                  onClick={() => switchActiveProfile(p.profileId)}
                >
                  {p.profileTitle}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ProfileSwitcherDialog);
