import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chip, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridColDef, GridRowModel, GridCellParams } from '@mui/x-data-grid';
import DoneIcon from '@mui/icons-material/Done';
import { useForm } from 'react-hook-form';
import { getUsers } from '../../store/actions/users';
import UserActions from '../../components/Admin/UserActions';
import { AppDispatch, RootState } from '../../store/reducers';
import { UserType } from '../../types/user';
import { resetInvitation } from '../../store/actions/batch';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const allUsers = useSelector((state: RootState) => state.users.users);
  const [filteredUsers, setFilteredUsers] = useState<UserType[] | null>(null);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const { register, watch } = useForm();
  const searchValue = watch("search", "");

  useEffect(() => {
    if (!allUsers) {      
      dispatch(getUsers());
    }
  }, [dispatch, allUsers]);

  useEffect(() => {
    const searchLowerCase = searchValue.toLowerCase();

    const filtered = allUsers?.filter(user => 
      user.firstName.toLowerCase().includes(searchLowerCase) || 
      user.lastName.toLowerCase().includes(searchLowerCase) ||
      user.loginEmail.toLowerCase().includes(searchLowerCase)
    );

    setFilteredUsers(filtered || null);
  }, [allUsers, searchValue]);

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
    { field: 'fullName', headerName: 'Name', width: 200 },
    { field: 'loginEmail', headerName: 'Email', width: 200 },
    { field: 'createdOn', headerName: 'Created On', width: 200 },
    {
      field: 'isTeamMaster', 
      headerName: 'Team Status', 
      width: 150,
      renderCell: (params: GridCellParams) => {
        if (params.row.isTeamMaster) {
          return <Chip 
                   icon={<DoneIcon />} 
                   label="Master" 
                   style={{backgroundColor: 'green', color: 'white'}} 
                 />;
        } else if (params.row.isTeamMember) {
          return <Chip 
                   icon={<DoneIcon />} 
                   label="Member" 
                   style={{backgroundColor: 'blue', color: 'white'}} 
                 />;
        }
        return <Chip label="Single" />;
      },
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
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

  if (!filteredUsers || filteredUsers.length === 0) {
    return <div>No users available.</div>;
  }

  return (
    <div>
      <TextField 
        {...register("search")} 
        type="text" 
        placeholder="Search by name or email..." 
        variant="outlined" 
        fullWidth
        margin="normal"
      />
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          onCellClick={(params) => {
            if (params.field !== 'actions') {
              handleViewUser(params.row.id as string);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Users;

