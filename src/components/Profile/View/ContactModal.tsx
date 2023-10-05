import React from 'react';
import { useSelector } from 'react-redux';
import { Modal, Typography } from '@mui/material';
import { Timestamp } from '@firebase/firestore';
import { RootState } from '../../../store/reducers';
import AddContactForm from '../../Contacts/AddContactForm';
import CustomForm from './CustomForm';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loadingData: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({ open, onClose, onSubmit, loadingData }) => {
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const profile = useSelector((state: RootState) => state.profile.profile);

  const appSetupCustomForm = appSetup && appSetup.contactFormData && appSetup.contactFormData.formProvider !== 'default' && appSetup.contactFormData.embedCode !== '' ? appSetup.contactFormData : null
  const profileCustomForm = profile && profile.contactFormData && profile.contactFormData.formProvider !== 'default' && profile.contactFormData.embedCode !== '' ? profile.contactFormData : null
  const customForm = appSetupCustomForm || profileCustomForm


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
        <Typography variant="h6">Share your contact info</Typography>
        <Typography>Fill in the form to exchange your contact information with me.</Typography>
        {customForm && customForm.formProvider && customForm.embedCode ? (
          <CustomForm 
            formType={customForm.formProvider as "google" | "microsoft" | "typeform" | "jotform"} 
            embedCode={customForm.embedCode} 
          />
        ) : (
          <AddContactForm
            loadingData={loadingData}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </Modal>
  );
};

export default ContactModal;
