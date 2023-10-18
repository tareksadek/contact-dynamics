import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Avatar, Typography, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridColDef, GridRowModel, GridCellParams } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import { getUsers } from '../../store/actions/users';
import UserActions from '../../components/Admin/UserActions';
import { AppDispatch, RootState } from '../../store/reducers';
import { UserType } from '../../types/user';
import { resetInvitation } from '../../store/actions/batch';
import { dataGridStyles } from './styles';

const Users: React.FC = () => {
  const classes = dataGridStyles()
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const allUsers = useSelector((state: RootState) => state.users.users);
  const [filteredUsers, setFilteredUsers] = useState<UserType[] | null>(null);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const { watch, control } = useForm();
  const searchTerm = watch("searchTerm", "");

  useEffect(() => {
    if (!allUsers) {      
      dispatch(getUsers());
    }
  }, [dispatch, allUsers]);

  useEffect(() => {
    const searchLowerCase = searchTerm.toLowerCase();

    const filtered = allUsers?.filter(user => 
      user.firstName.toLowerCase().includes(searchLowerCase) || 
      user.lastName.toLowerCase().includes(searchLowerCase) ||
      user.loginEmail.toLowerCase().includes(searchLowerCase)
    );

    setFilteredUsers(filtered || null);
  }, [allUsers, searchTerm]);

  const handleViewUser = (userId: string) => {
    navigate(`/users/${userId}`)
  }

  const handleDeleteUser = (batchId: string, invitationId: string, usedBy: string) => {
    let message = 'Deleting a user will remove all user data and reset the related invitation. Continue?';

    if (!window.confirm(message)) {
      return;
    }
    if (usedBy) {
      dispatch(resetInvitation(batchId, invitationId, usedBy));
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const names = params.row.fullName ? params.row.fullName.split(' ') : [];
        const initials = `${names[0] ? names[0][0] : ''}${names[1] ? names[1][0] : ''}`;
    
        return (
          <Box display="flex" alignItems="center">
            <Avatar className={classes.avatar}>{initials}</Avatar>
            <Box ml={1}>
              <Typography variant="body1" className={classes.fullName}>
                {typeof params.value === 'string' ? params.value : ''}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    { 
      field: 'actions', 
      headerName: '', 
      width: 60,
      renderCell: (params: GridRowModel) => (
        <UserActions 
          batchId={params.row.batchId as string}
          invitationId={params.row.invitationId as string}
          userId={params.row.id as string} 
          onDelete={(batchId, invitationId, usedBy) => { handleDeleteUser(params.row.batchId, params.row.invitationId, params.row.id) }}
          onViewUser={(id) => { handleViewUser(id) }}
          onViewUserContacts={(id) => { navigate(`/users/${id}/contacts`); }}
          onViewUserAnalytics={(id) => { navigate(`/users/${id}/analytics`); }}
        />
      ),
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box minHeight="500px">
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
            label="Search name or email..."
          />
        )}
      />
      {!filteredUsers || filteredUsers.length === 0 ? (
        <Alert severity="warning">No users available.</Alert>
      ) : (
        <Box height={allUsers ? (allUsers.length * 100) - 50 : 400}>
          <DataGrid
            rows={filteredUsers}
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
                handleViewUser(params.row.id as string);
              }
            }}
            className={`${classes.gridContainer} ${classes.noHeaderGrid}`}
          />
        </Box>
      )}
      
    </Box>
  );
};

export default Users;

