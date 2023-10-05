import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface BatchActionsProps {
  onEdit: (batchId: string) => void;
  onDelete: (batchId: string) => void;
  onViewInvitations: (batchId: string) => void;
  batchId: string;
}

const BatchActions: React.FC<BatchActionsProps> = ({ onEdit, onDelete, onViewInvitations, batchId }) => {
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
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          onViewInvitations(batchId);
          handleClose();
        }}>
          View invitations
        </MenuItem>
        <MenuItem onClick={() => {
          onEdit(batchId);
          handleClose();
        }}>
          Edit batch title
        </MenuItem>
        <MenuItem onClick={() => {
          onDelete(batchId);
          handleClose();
        }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default BatchActions;
