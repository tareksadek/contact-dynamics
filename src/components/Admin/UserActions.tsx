import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface UserActionsProps {
  onDelete: (userId: string) => void;
  onViewUser: (userId: string) => void;
  userId: string;
}

const UserActions: React.FC<UserActionsProps> = ({ onDelete, onViewUser, userId }) => {
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
          onDelete(userId);
          handleClose();
        }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserActions;
