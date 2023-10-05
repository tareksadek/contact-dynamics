import React from 'react';
import { Modal, Typography } from '@mui/material';
import { Timestamp } from '@firebase/firestore';
import AddContactForm from './AddContactForm';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loadingData: boolean;
}

const AddContactModal: React.FC<ContactModalProps> = ({ open, onClose, onSubmit, loadingData }) => {
  const handleFormSubmit = async (data: any) => {
    const enhancedData = {
      ...data,
      createdOn: Timestamp.now().toDate()
    };
    await onSubmit(enhancedData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: '2rem', maxWidth: '550px', margin: 'auto', backgroundColor: '#fff' }}>
        <Typography variant="h6">Add new contact</Typography>
        <AddContactForm
          isSave
          loadingData={loadingData}
          onSubmit={handleFormSubmit}
        />
      </div>
    </Modal>
  );
};

export default AddContactModal;
