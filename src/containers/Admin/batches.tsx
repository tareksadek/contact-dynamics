import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Chip, Box, TextField, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridColDef, GridRowModel, GridCellParams } from '@mui/x-data-grid';
import { getBatches } from '../../store/actions/batch';
import BatchActions from '../../components/Admin/BatchActions';
import { AppDispatch, RootState } from '../../store/reducers';
import { layoutStyles } from '../../theme/layout';
import { dataGridStyles } from './styles';
import { updateBatchTitle } from '../../store/actions/batch';
import { openModal, closeMenu } from '../../store/actions/modal';
import { BatchData } from '../../types/userInvitation';
import EditBatchModal from '../../components/Admin/EditBatchModal';

const Batches: React.FC = () => {
  const layoutClasses = layoutStyles()
  const classes = dataGridStyles()
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const batches = useSelector((state: RootState) => state.batches.batches);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isEditBatchModalOpen = openModalName === 'editBatch';

  const { watch, control } = useForm();
  const searchTerm = watch('searchTerm', '');

  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null)

  useEffect(() => {
    if (!batches) {
      dispatch(getBatches());
    }
  }, [dispatch, batches]);

  console.log(batches);

  const goToCreateBatch = () => {
    navigate('/createBatch')
  }

  const handleViewInvitations = (id: string) => {
    navigate(`/batches/${id}/invitations`)
  }

  const handleEditBatchSubmit = async (batchId: string, title: string) => {
    dispatch(updateBatchTitle(batchId, title))
  };

  const handleEditBatch = (batchId: string) => {
    let batch = null
    if (batches && batches.length > 0) {
      batch = batches.find(b => b.id === batchId);
    }

    setSelectedBatch(batch || null)
    dispatch(openModal('editBatch'));
  }

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Batch Title', flex: 1 },
    { field: 'createdOn', headerName: 'Created On', width: 120 },
    {
      field: 'isTeams',
      headerName: 'Type',
      width: 100,
      renderCell: (params: GridCellParams) => {
        if (params.row.isTeams) {
          return <Chip
            label="Teams"
            className={classes.teamsChip}
          />;
        }
        return <Chip label="Default" />;
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      renderCell: (params: GridRowModel) => (
        <BatchActions
          batchId={params.row.id as string}
          onEdit={(id) => handleEditBatch(id)}
          onDelete={(id) => console.log(`Delete ${id}`)}
          onViewInvitations={(id) => handleViewInvitations(id)}
        />
      ),
    }
  ];

  const filteredBatches = batches
    ? batches.filter((batch) =>
      batch.title && batch.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

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
            label="Search batches..."
          />
        )}
      />
      {!filteredBatches || filteredBatches.length === 0 ? (
        <Alert severity="warning">No batches available.</Alert>
      ) : (
        <>
          <DataGrid
            rows={filteredBatches}
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
                handleViewInvitations(params.row.id as string);
              }
            }}
            className={classes.gridContainer}
          />

          <EditBatchModal
            batch={selectedBatch}
            open={isEditBatchModalOpen}
            onClose={() => dispatch(closeMenu())}
            onSubmit={handleEditBatchSubmit}
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
          onClick={() => goToCreateBatch()}
          fullWidth
          variant="contained"
          color="primary"
        >
          Create batch
        </Button>
      </Box>
    </Box>
  );
};

export default Batches;
