import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import QRCodeStyling from "qr-code-styling";
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import DoneIcon from '@mui/icons-material/Done';
import { Button, Chip, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { getInvitationsByBatchId, addInvitations } from '../../store/actions/batch';
import { AppDispatch, RootState } from '../../store/reducers';
import { useParams } from 'react-router-dom';
import InvitationActions from '../../components/Admin/InvitationActions';
import AddInvitationDrawer from '../../components/Admin/AddInvitationDrawer';
import InvitationQrCode from '../../components/Admin/InvitationQrCode';
import LoadingBackdrop from '../../components/Loading/LoadingBackdrop';
import { appDomain } from '../../setup/setup';
import { openModal, closeMenu } from '../../store/actions/modal';
import { layoutStyles } from '../../theme/layout';
import { dataGridStyles } from './styles';

const Invitations: React.FC = () => {
  const layoutClasses = layoutStyles()
  const classes = dataGridStyles()
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null)
  const [isProcessingQRs, setIsProcessingQRs] = useState(false);

  const params = useParams<{ batchId: string }>();
  const batchId = params?.batchId || "";

  const dispatch = useDispatch<AppDispatch>();

  const invitations = useSelector((state: RootState) => state.batches.selectedBatch?.invitations || []);
  const selectedBatch = useSelector((state: RootState) => state.batches.selectedBatch?.data || null);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);  
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isInvitationQrModalOpen = openModalName === 'invQr';
  const isAddInvitationsModalOpen = openModalName === 'addInv';

  useEffect(() => {
    if (batchId) {
      dispatch(getInvitationsByBatchId(batchId));
    }
  }, [dispatch, batchId]);

  const handleAddInvitationsDrawerSubmit = (data: { numberOfInvitations: number }) => {
    if (selectedBatch) {
      dispatch(addInvitations(selectedBatch, data.numberOfInvitations, false));
    }
    dispatch(closeMenu())
  };

  const handleQrClick = (invitationId: string) => {
    if (invitationId) {
      setSelectedInvitationId(invitationId)
    }
    dispatch(openModal('invQr'))
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
      flex: 1
    },
    {
      field: 'used', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params: GridCellParams) => {
        if (params.row.used) {
          return <Chip 
                   label="Used" 
                   className={classes.teamsChip}
                   style={{ minWidth: 80 }}
                 />;
        }
        return <Chip label="Available" style={{ minWidth: 80 }} />;
      },
    },
    { 
      field: 'actions', 
      headerName: '', 
      width: 60,
      renderCell: (params: GridCellParams) => (
        <InvitationActions 
          batchId={batchId}
          invitationId={params.row.id as string} 
          used={params.row.used}
          usedBy={params.row.usedBy}
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
    <Box minHeight="500px">
      {isProcessingQRs && (
        <LoadingBackdrop 
          message="Generating QR Codes..."
          onComplete={() => true}
          cubed
        />
      )}
      
      <Button
        onClick={downloadAllQRs}
        disabled={isProcessingQRs}
        startIcon={<DownloadIcon />}
      >
        Download All QR Codes
      </Button>
      
      <AddInvitationDrawer 
        open={isAddInvitationsModalOpen} 
        onClose={() => dispatch(closeMenu())} 
        onSubmit={handleAddInvitationsDrawerSubmit}
      />

      <InvitationQrCode
        open={isInvitationQrModalOpen}
        onClose={() => dispatch(closeMenu())}
        invitationId={selectedInvitationId}
        batchId={batchId}
      />

      <DataGrid
        rows={invitations}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        className={classes.gridContainer}
      />

      <Box
        className={layoutClasses.stickyBottomBox}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          onClick={() => dispatch(openModal('addInv'))}
          fullWidth
          variant="contained"
          color="primary"
          disabled={isProcessingQRs}
        >
          Add invitations
        </Button>
      </Box>
    </Box>
  );
};

export default Invitations;
