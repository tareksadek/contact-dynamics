import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/reducers';
import { Dialog, DialogContent, List, ListItem, ListItemText, Box, ListItemButton } from '@mui/material';
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
        <Box maxWidth={550} margin="auto" width="100%">
          <List>
            {user?.profileList?.map((p) => (
              <ListItem key={p.profileId}>
                <ListItemButton
                  disabled={p.profileId === user?.activeProfileId}
                  onClick={() => switchActiveProfile(p.profileId)}
                >
                  <ListItemText primary={p.profileTitle} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ProfileSwitcherDialog);
