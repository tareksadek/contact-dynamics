import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import QRCodeStyling from "qr-code-styling";
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import DoneIcon from '@mui/icons-material/Done';
import { Button, Chip } from '@mui/material';
import { getInvitationsByBatchId, addInvitations } from '../../store/actions/batch';
import { AppDispatch, RootState } from '../../store/reducers';
import { useParams } from 'react-router-dom';
import InvitationActions from '../../components/Admin/InvitationActions';
import AddInvitationDrawer from '../../components/Admin/AddInvitationDrawer';
import InvitationQrCode from '../../components/Admin/InvitationQrCode';
import LoadingBackdrop from '../../components/Loading/LoadingBackdrop';
import { appDomain } from '../../setup/setup';

const Invitations: React.FC = () => {
  const [addInvitationsDrawerOpen, setAddInvitationsDrawerOpen] = useState(false);
  const [qrDrawerOpen, setQrDrawerOpen] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null)
  const [isProcessingQRs, setIsProcessingQRs] = useState(false);

  const params = useParams<{ batchId: string }>();
  const batchId = params?.batchId || "";

  const dispatch = useDispatch<AppDispatch>();

  const invitations = useSelector((state: RootState) => state.batches.selectedBatch?.invitations || []);
  const selectedBatch = useSelector((state: RootState) => state.batches.selectedBatch?.data || null);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);  

  useEffect(() => {
    if (batchId) {
      dispatch(getInvitationsByBatchId(batchId));
    }
  }, [dispatch, batchId]);

  const handleAddInvitationsDrawerClose = () => {
    setAddInvitationsDrawerOpen(false);
  };

  const handleAddInvitationsDrawerSubmit = (data: { numberOfInvitations: number }) => {
    if (selectedBatch) {
      dispatch(addInvitations(selectedBatch, data.numberOfInvitations, false));
    }
    handleAddInvitationsDrawerClose();
  };

  const handleQrClick = (invitationId: string) => {
    if (invitationId) {
      setSelectedInvitationId(invitationId)
    }
    setQrDrawerOpen(true);
  };

  const generateFilename = (batch: any) => {
    if (batch.title) {
        return `${batch.title.replace(/\s+/g, '_').toLowerCase()}_batch_QR_codes.zip`;
    }
    return `${batch.id}_batch_QR_codes.zip`;
  }

  const downloadAllQRs = async () => {
    setIsProcessingQRs(true);

    const zip = new JSZip();
    for (const invitation of invitations) {
      const qr = new QRCodeStyling({
        width: 200,
        height: 200,
        data: `${appDomain}/activate?tac=${invitation.id}_${batchId}`,
        dotsOptions: {
          color: '#000000',
          type: 'rounded',
        },
      });
  
      const svgString = await qr.getRawData("svg");
      if (svgString) {
        zip.file(`${invitation.id}_${batchId}.svg`, svgString);
      }
    }
  
    zip.generateAsync({ type: "blob" }).then(function(content) {
      const filename = generateFilename(selectedBatch);
      saveAs(content, filename);

      setIsProcessingQRs(false);
    });
  }

  const columns: GridColDef[] = [
    {
      field: 'id', 
      headerName: 'Code', 
      width: 150
    },
    {
      field: 'used', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params: GridCellParams) => {
        if (params.row.used) {
          return <Chip 
                   icon={<DoneIcon />} 
                   label="Used" 
                   style={{backgroundColor: 'green', color: 'white'}} 
                 />;
        }
        return <Chip label="Available" />;
      },
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params: GridCellParams) => (
        <InvitationActions 
          batchId={batchId}
          invitationId={params.row.id as string} 
          used={params.row.used}
          openQrDrawer={handleQrClick}
        />
      ),
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!invitations || invitations.length === 0) {
    return <div>No invitations available for this batch.</div>;
  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      {isProcessingQRs && (
        <LoadingBackdrop 
          message="Generating QR Codes..."
          onComplete={() => true}
        />
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={() => setAddInvitationsDrawerOpen(true)}
        disabled={isProcessingQRs}
      >
        Add invitations
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={downloadAllQRs}
        disabled={isProcessingQRs}
      >
        Download All QR Codes
      </Button>
      
      <AddInvitationDrawer 
        open={addInvitationsDrawerOpen} 
        onClose={handleAddInvitationsDrawerClose} 
        onSubmit={handleAddInvitationsDrawerSubmit}
      />

      <InvitationQrCode
        open={qrDrawerOpen}
        onClose={() => setQrDrawerOpen(false)}
        invitationId={selectedInvitationId}
        batchId={batchId}
      />

      <DataGrid
        rows={invitations}
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

export default Invitations;
