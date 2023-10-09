import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface UserActionsProps {
  onDelete: (batchId: string, invitationId: string, usedBy: string) => void;
  onViewUser: (userId: string) => void;
  onViewUserContacts: (userId: string) => void;
  onViewUserAnalytics: (userId: string) => void;
  batchId: string;
  invitationId: string;
  userId: string;
}

const UserActions: React.FC<UserActionsProps> = ({
  onDelete,
  onViewUser,
  onViewUserContacts,
  onViewUserAnalytics,
  batchId,
  invitationId,
  userId
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          onViewUser(userId);
          handleClose();
        }}>
          Details
        </MenuItem>
        <MenuItem onClick={() => {
          onViewUserContacts(userId);
          handleClose();
        }}>
          Contacts
        </MenuItem>
        <MenuItem onClick={() => {
          onViewUserAnalytics(userId);
          handleClose();
        }}>
          Analytics
        </MenuItem>
        <MenuItem onClick={() => {
          onDelete(batchId, invitationId, userId);
          handleClose();
        }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserActions;
