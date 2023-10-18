import React from 'react';
import { Drawer, Typography, Box, IconButton } from '@mui/material';
import EditBatchForm from './EditBatchForm';
import { BatchData } from '../../types/userInvitation';
import { layoutStyles } from '../../theme/layout';
import CloseIcon from '@mui/icons-material/Close';

interface ContactModalProps {
  batch?: BatchData | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: any) => Promise<void>;
  loadingData: boolean;
}

const EditBatchModal: React.FC<ContactModalProps> = ({
  batch,
  open,
  onClose,
  onSubmit,
  loadingData,
}) => {
  const layoutClasses = layoutStyles()
  const handleFormSubmit = async (data: any) => {
    if (batch && batch.id) {
      await onSubmit(batch.id, data.title);
      onClose();
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: layoutClasses.radiusBottomDrawer
      }}
    >
      <Box p={2}>
        <Typography variant="h4" align="center">Edit batch</Typography>
        <EditBatchForm
          batch={batch}
          loadingData={loadingData}
          onSubmit={handleFormSubmit}
        />
      </Box>
      <IconButton
        aria-label="delete"
        color="primary"
        className={layoutClasses.drawerCloseButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Drawer>
  );
};

export default EditBatchModal;
