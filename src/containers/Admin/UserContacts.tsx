import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import { DataGrid, GridRowModel } from '@mui/x-data-grid';
import { fetchUserContacts } from '../../store/actions/users'; 
import { RootState, AppDispatch } from '../../store/reducers';
import ContactActions from '../../components/Contacts/ContactActions';
import ViewContactModal from '../../components/Contacts/ViewContactModal';
import CsvDownloader from '../../components/Contacts/CsvDownloader';
import { ContactType } from '../../types/contact';
import { openModal, closeMenu } from '../../store/actions/modal';
import { createVCF } from '../../utilities/utils';

const UserContacts: React.FC = () => {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId || "";
  const dispatch = useDispatch<AppDispatch>();
  const selectedUser = useSelector((state: RootState) => state.users.selectedUser);
  const contacts = useSelector((state: RootState) => state.users.selectedUser?.contacts);
  const contactsLoaded = useSelector((state: RootState) => state.users.contactsLoaded);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isViewContactModalOpen = openModalName === 'viewContact';

  const { watch, control } = useForm();
  const searchTerm = watch('searchTerm', '');

  const [selectedContact, setSelectedContact] = useState<ContactType | null>(null)

  useEffect(() => {
    if ((userId && !contactsLoaded) || (userId && selectedUser && userId !== selectedUser.id)) {
      dispatch(fetchUserContacts(userId));
    }
  }, [userId, selectedUser, dispatch, contactsLoaded]);

  const handleViewContact = (contactId: string) => {
    let contact = null
    if (contacts && contacts.length > 0) {
      contact = contacts.find(contact => contact.id === contactId);
    }
    
    setSelectedContact(contact || null)
    dispatch(openModal('viewContact'));
  }

  const handleDownloadVCard = (contactId: string) => {
    let contact = null
    if (contacts && contacts.length > 0) {
      contact = contacts.find(contact => contact.id === contactId);
    }
    if (!contact) {
        console.error("Contact data is null");
        return;
    }

    const vcfString = createVCF(contact, null, null);

    const fileName = `${contact?.firstName || ''}_${contact?.lastName || ''}_Contacts`

    const blob = new Blob([vcfString], { type: 'text/vcard' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredContacts = contacts 
  ? contacts.filter((contact) => 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.lastName && contact.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : [];

  const columns = [
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'createdOn', headerName: 'Created On', width: 200 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params: GridRowModel) => (
        <ContactActions 
          contactId={params.row.id as string} 
          onEdit={null}
          onDelete={null}
          onViewDetails={(id) => handleViewContact(id)}
          onAddToContacts={(id) => handleDownloadVCard(id)}
        />
      ),
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div>
        <div>No contacts available.</div>
      </div>
    );
  }

  return (
    <div style={{ height: 800, width: '100%' }}>
      <CsvDownloader
        contacts={contacts}
        fileName={selectedUser ? `${selectedUser.firstName || ''}_${selectedUser.lastName || ''}` : null}
      />

      <Controller
        name="searchTerm"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Search contacts..."
          />
        )}
      />

      <DataGrid
        rows={filteredContacts}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        onCellClick={(params) => {
          if (params.field !== 'actions') {
            handleViewContact(params.row.id as string);
          }
        }}
      />

      <ViewContactModal
        contact={selectedContact}
        open={isViewContactModalOpen}
        onClose={() => dispatch(closeMenu())}
        onAddToContacts={handleViewContact}
      />
    </div>
  );
};

export default UserContacts;