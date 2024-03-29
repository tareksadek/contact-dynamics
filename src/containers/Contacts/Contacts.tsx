import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, Box, Typography, Avatar, Alert } from '@mui/material';
import { DataGrid, GridRowModel } from '@mui/x-data-grid';
import { GridCellParams } from '@mui/x-data-grid';
import { fetchAllContacts } from '../../store/actions/contact';
import { RootState, AppDispatch } from '../../store/reducers';
import AddContactModal from '../../components/Contacts/AddContactModal';
import EditContactModal from '../../components/Contacts/EditContactModal';
import ContactActions from '../../components/Contacts/ContactActions';
import ViewContactModal from '../../components/Contacts/ViewContactModal';
import CsvDownloader from '../../components/Contacts/CsvDownloader';
import { addNewContact, updateContact, deleteContact } from '../../store/actions/contact';
import { ContactType } from '../../types/contact';
import { openModal, closeMenu } from '../../store/actions/modal';
import { createVCF } from '../../utilities/utils';
import { layoutStyles } from '../../theme/layout';
import { dataGridStyles } from './styles';

const Contacts: React.FC = () => {
  const layoutClasses = layoutStyles()
  const classes = dataGridStyles()
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const contactsLoaded = useSelector((state: RootState) => state.contacts.contactsLoaded);
  const contactsProfileId = useSelector((state: RootState) => state.contacts.profileId);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);
  const authId = useSelector((state: RootState) => state.authUser.userId);
  const isAccountOwner = isLoggedIn && (authId === user?.id)

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isAddContactModalOpen = openModalName === 'addContact';
  const isEditContactModalOpen = openModalName === 'editContact';
  const isViewContactModalOpen = openModalName === 'viewContact';

  const { watch, control } = useForm();
  const searchTerm = watch('searchTerm', '');

  const [selectedContact, setSelectedContact] = useState<ContactType | null>(null)

  useEffect(() => {
    if (user && profile && profile.id && (!contactsLoaded || profile.id !== contactsProfileId)) {
      dispatch(fetchAllContacts(user.id, profile.id));
    }
  }, [user, profile, dispatch, contactsLoaded, contactsProfileId]);

  const handleViewContact = (contactId: string) => {
    let contact = null
    if (contacts && contacts.length > 0) {
      contact = contacts.find(contact => contact.id === contactId);
    }

    setSelectedContact(contact || null)
    dispatch(openModal('viewContact'));
  }

  const handleEditContact = (contactId: string) => {
    let contact = null
    if (contacts && contacts.length > 0) {
      contact = contacts.find(contact => contact.id === contactId);
    }

    setSelectedContact(contact || null)
    dispatch(openModal('editContact'));
  }

  const handleDeleteContact = async (contactId: string) => {
    if (user && user.id && profile && profile.id) {
      const confirmBox = window.confirm('Are you sure you want to remove this contact?')
      if (confirmBox === true) {
        dispatch(deleteContact(user.id, profile.id, contactId))
      }
    }
  };

  const handleAddContactSubmit = async (data: any) => {
    if (user && user.id && profile && profile.id) {
      data.isUnique = !isAccountOwner
      dispatch(addNewContact(user.id, profile.id, data))
    }
  };

  const handleEditContactSubmit = async (contactId: string, data: any) => {
    if (user && user.id && profile && profile.id) {
      dispatch(updateContact(user.id, profile.id, contactId, data))
    }
  };

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
    // { field: 'firstName', headerName: 'First name', width: 130 },
    // { field: 'lastName', headerName: 'Last name', width: 130 },
    // { field: 'email', headerName: 'Email', width: 200 },
    // { field: 'phone', headerName: 'Phone', width: 150 },
    // { field: 'createdOn', headerName: 'Created On', width: 200 },
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1,
      valueGetter: (params: GridCellParams) => `${params.row.firstName} ${params.row.lastName}`,
      renderCell: (params: GridCellParams) => {
        const initials = `${params.row.firstName[0] || ''}${params.row.lastName[0] || ''}`;

        return (
          <Box display="flex" alignItems="center">
            <Avatar className={classes.avatar}>{initials}</Avatar>
            <Box ml={1}>
              <Typography variant="body1" className={classes.fullName}>
                {typeof params.value === 'string' ? params.value : ''}
              </Typography>
              <Typography variant="body2">
                {params.row.phone}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 60,
      renderCell: (params: GridRowModel) => (
        <ContactActions
          contactId={params.row.id as string}
          onEdit={(id) => handleEditContact(id)}
          onDelete={(id) => handleDeleteContact(id)}
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
      <div style={{ height: 800, width: '100%' }}>
        <Button
          variant="contained"
          onClick={() => dispatch(openModal('addContact'))}
        >
          Add contact
        </Button>
        <div>No contacts available.</div>
        <AddContactModal
          open={isAddContactModalOpen}
          onClose={() => dispatch(closeMenu())}
          onSubmit={handleAddContactSubmit}
          loadingData={false}
        />
      </div>
    );
  }

  return (
    <Box pb={2}>
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

      <Box>
        <CsvDownloader
          contacts={contacts}
          fileName={profile && profile.basicInfoData ? `${profile.basicInfoData.firstName || ''}_${profile.basicInfoData.lastName || ''}` : null}
        />
      </Box>

      {!filteredContacts || filteredContacts.length === 0 ? (
        <Alert severity="warning">No batches available.</Alert>
      ) : (
        <>
          <Box height={(contacts.length * 100) - 50}>
            <DataGrid
              rows={filteredContacts}
              columns={columns}
              rowHeight={75}
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
              className={classes.gridContainer}
            />
          </Box>

          <AddContactModal
            open={isAddContactModalOpen}
            onClose={() => dispatch(closeMenu())}
            onSubmit={handleAddContactSubmit}
            loadingData={false}
          />

          <ViewContactModal
            contact={selectedContact}
            open={isViewContactModalOpen}
            onClose={() => dispatch(closeMenu())}
            onAddToContacts={handleDownloadVCard}
          />

          <EditContactModal
            contact={selectedContact}
            open={isEditContactModalOpen}
            onClose={() => dispatch(closeMenu())}
            onSubmit={handleEditContactSubmit}
            loadingData={false}
          />
        </>
      )}


      <Box
        className={layoutClasses.stickyBottomBox}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          onClick={() => dispatch(openModal('addContact'))}
          fullWidth
          variant="contained"
          color="primary"
        >
          Add contact
        </Button>
      </Box>
    </Box>
  );
};

export default Contacts;