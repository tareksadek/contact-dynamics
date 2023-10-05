import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Chip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridColDef, GridRowModel, GridCellParams } from '@mui/x-data-grid';
import DoneIcon from '@mui/icons-material/Done';
import { getBatches } from '../../store/actions/batch';
import BatchActions from '../../components/Admin/BatchActions';
import { AppDispatch, RootState } from '../../store/reducers';

const Batches: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const batches = useSelector((state: RootState) => state.batches.batches);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);

  useEffect(() => {
    if (!batches) {      
      dispatch(getBatches());
    }
  }, [dispatch, batches]);

  console.log(batches);

  const goToCreateBatch = () => {
    navigate('/createBatch')
  }

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Batch Title', width: 200 },
    { field: 'createdOn', headerName: 'Created On', width: 200 },
    {
      field: 'isTeams', 
      headerName: 'Type', 
      width: 150,
      renderCell: (params: GridCellParams) => {
        if (params.row.isTeams) {
          return <Chip 
                   icon={<DoneIcon />} 
                   label="Teams" 
                   style={{backgroundColor: 'green', color: 'white'}} 
                 />;
        }
        return <Chip label="Default" />;
      },
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params: GridRowModel) => (
        // We will define the BatchActions component next
        <BatchActions 
          batchId={params.row.id as string} 
          onEdit={(id) => console.log(`Edit ${id}`)}
          onDelete={(id) => console.log(`Delete ${id}`)}
          onViewInvitations={(id) => { navigate(`/batches/${id}/invitations`); }}
        />
      ),
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!batches || batches.length === 0) {
    return <div>No batches available.</div>;
  }

    return (
      <div style={{ height: 500, width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => goToCreateBatch()}
          // disabled={isProcessingQRs}
        >
          Create batch
        </Button>
        <DataGrid
          rows={batches}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
        />
      </div>
    );

};

export default Batches;
