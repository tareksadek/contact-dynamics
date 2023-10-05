import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { RootState, AppDispatch } from '../../../store/reducers';
import { createVCF } from '../../../utilities/utils';
import { appDomain } from '../../../setup/setup';
import ContactModal from './ContactModal';
import { startLoading, stopLoading } from '../../../store/actions/loadingCenter';
import { setNotification } from '../../../store/actions/notificationCenter';
import { createContact } from '../../../API/contact';
import { incrementAddedToContacts } from '../../../API/profile';
import { openModal, closeMenu } from '../../../store/actions/modal';

interface ActionButtonsProps {
  buttonStyles: {
    layout: string | null;
    buttonStyle: string | null;
  }
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ buttonStyles }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const isAccountOwner = isLoggedIn && (authId === user?.id)

  const dispatch = useDispatch<AppDispatch>();

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isContactModalOpen = openModalName === 'connect';

  const downloadVCard = async () => {
    if (!profile) {
        console.error("Profile data is null");
        return;
    }

    // Increment the addedToContacts count
    if (user && user.id && profile && profile.id && (!isLoggedIn || !isAccountOwner)) {
      await incrementAddedToContacts(user.id, profile.id); 
    }

    const vcfString = createVCF(profile, appDomain, user && user?.profileUrlSuffix ? user.profileUrlSuffix : '');
    const fileName = `${profile.basicInfoData?.firstName || ''}_${profile.basicInfoData?.lastName || ''}_Contacts`

    const blob = new Blob([vcfString], { type: 'text/vcard' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleModalSubmit = async (data: any) => {
    if (user && user.id && profile && profile.id) {
      dispatch(startLoading('Sending contact info...'));
      data.isUnique = !isLoggedIn || !isAccountOwner
      const response = await createContact(user.id, profile.id, data);

      if (response.success) {
        dispatch(stopLoading());
        dispatch(setNotification({ message: 'Contact info sent successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
      } else {
        dispatch(stopLoading());
        dispatch(setNotification({ message: response.error, type: 'error', horizontal: 'right', vertical: 'top' }));
      }
    }
  };

  return (
    <div>
      {buttonStyles.layout === 'divided' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderRadius: '5px' }}>
          <Button
            variant="contained"
            onClick={() => dispatch(openModal('connect'))}
          >
            Connect
          </Button>
          <Button
            variant="contained"
            onClick={downloadVCard}
          >
            Add to contact
          </Button>
        </div>
      )}
      {buttonStyles.layout === 'icon' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderRadius: '5px' }}>
          <Button
            variant="contained"
            onClick={() => dispatch(openModal('connect'))}
          >
            Connect
          </Button>
          <Button variant="contained">
            <AddIcCallIcon />
          </Button>
        </div>
      )}
      <ContactModal
        open={isContactModalOpen}
        onClose={() => dispatch(closeMenu())}
        onSubmit={handleModalSubmit}
        loadingData={false}
      />
    </div>
  );
};

export default ActionButtons;
