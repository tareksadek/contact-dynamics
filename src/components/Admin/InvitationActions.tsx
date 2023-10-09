import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { resetInvitation } from '../../store/actions/batch';
import { AppDispatch } from '../../store/reducers';
import copy from 'clipboard-copy';
import { setNotification } from '../../store/actions/notificationCenter';
import { appDomain } from '../../setup/setup';

interface Props {
  batchId: string;
  invitationId: string;
  used: boolean;
  usedBy: string | null;
  openQrDrawer: (invitationId: string) => void;
}

const InvitationActions: React.FC<Props> = ({
  batchId,
  invitationId,
  used,
  usedBy,
  openQrDrawer,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleResetInvitation = () => {
    let message = 'Resetting an invitation will delete all user data and make the invitation reusable. Continue?';

    if (!window.confirm(message)) {
      return;
    }
    if (usedBy) {
      dispatch(resetInvitation(batchId, invitationId, usedBy));
    }
    handleClose();
  };

  const handleQrDrawer = () => {
    openQrDrawer(invitationId)
    handleClose();
  }

  const handleCopyToClipboard = () => {
    const invitationLink = `${appDomain}/activate?tac=${invitationId}_${batchId}`;
    copy(invitationLink)
      .then(() => {
        dispatch(setNotification({ 
          message: 'Invitation link copied successfully.', 
          type: 'success', 
          horizontal: 'right', 
          vertical: 'top' 
        }));
      })
      .catch(err => console.error("Failed to copy invitation link: ", err));
    handleClose();
  };

  const handleEmailInvitation = () => {
    const invitationLink = `${appDomain}/activate?tac=${invitationId}_${batchId}`;
    const subject = encodeURIComponent("Create your digital card");
    const body = encodeURIComponent(`Click the link below to create your digital card:\n\n${invitationLink}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    handleClose();
  };

  const handleViewUser = () => {
    if (usedBy) {
      navigate(`/users/${usedBy}`)
    }
  }

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleCopyToClipboard}>Copy Invitation Code</MenuItem> 
        <MenuItem onClick={handleEmailInvitation}>Email Invitation</MenuItem>
        <MenuItem disabled={!used} onClick={handleViewUser}>View User</MenuItem>
        <MenuItem onClick={handleQrDrawer}>View / Download Qr code</MenuItem>
        <MenuItem onClick={handleResetInvitation} disabled={!used}>Reset Invitation</MenuItem>
      </Menu>
    </>
  );
};

export default InvitationActions;
