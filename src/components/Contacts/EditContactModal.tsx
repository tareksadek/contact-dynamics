import React from 'react';
import { Modal, Typography } from '@mui/material';
import { Timestamp } from '@firebase/firestore';
import AddContactForm from './AddContactForm';
import { ContactType } from '../../types/contact';

interface ContactModalProps {
  contact?: ContactType | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: any) => Promise<void>;
  loadingData: boolean;
}

const EditContactModal: React.FC<ContactModalProps> = ({
  contact,
  open,
  onClose,
  onSubmit,
  loadingData,
}) => {
  const handleFormSubmit = async (data: any) => {
    if (contact && contact.id) {
      const enhancedData = {
        ...data,
        createdOn: Timestamp.now().toDate()
      };
      await onSubmit(contact.id, enhancedData);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: '2rem', maxWidth: '550px', margin: 'auto', backgroundColor: '#fff' }}>
        <Typography variant="h6">Add new contact</Typography>
        <AddContactForm
          isEdit
          contact={contact}
          loadingData={loadingData}
          onSubmit={handleFormSubmit}
        />
      </div>
    </Modal>
  );
};

export default EditContactModal;
