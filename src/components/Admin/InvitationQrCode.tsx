import React, { useRef, useEffect, useState } from 'react';
import { Drawer, Button, Box, IconButton } from '@mui/material';
import QRCodeStyling from "qr-code-styling";
import { appDomain } from '../../setup/setup';
import { layoutStyles } from '../../theme/layout';
import CloseIcon from '@mui/icons-material/Close';

interface InvitationQrCodeProps {
  open: boolean;
  onClose: () => void;
  invitationId: string | null;
  batchId: string;
}

const qrCode = new QRCodeStyling({
  width: 200,
  height: 200,
  dotsOptions: {
    color: '#000000',
    type: 'rounded',
  },
});

const InvitationQrCode: React.FC<InvitationQrCodeProps> = ({ open, onClose, invitationId, batchId }) => {
  const layoutClasses = layoutStyles()
  const [showQrCode, setShowQrCode] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => {
        setShowQrCode(true);
      }, 300); // Assuming the drawer's animation takes about 300ms
    } else {
      setShowQrCode(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (open && showQrCode && qrContainerRef.current) {
      qrCode.append(qrContainerRef.current);
      const newData = `${appDomain}/activate?tac=${invitationId}_${batchId}`;
      qrCode.update({ data: newData });
    }
  }, [invitationId, batchId, open, showQrCode]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: layoutClasses.radiusBottomDrawer
      }}
    >
      <Box>
        <Box minHeight={200} display="flex" alignItems="center" justifyContent="center" p={2}>
          {showQrCode && <div id="qr-container" ref={qrContainerRef} style={{ width: 200, height: 200 }}></div>}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} p={2}>
          <Button
            onClick={() => qrCode.download({
              extension: "svg",
              name: `${invitationId}_${batchId}`
            })}
            variant="contained"
            color="primary"
            fullWidth
          >
            Save as SVG
          </Button>

          <Button
            onClick={() => qrCode.download({
              extension: "png",
              name: `${invitationId}_${batchId}`
            })}
            variant="contained"
            color="primary"
            fullWidth
          >
            Save as PNG
          </Button>
        </Box>
      </Box>
      <IconButton
        aria-label="delete"
        color="primary"
        className={layoutClasses.drawerCloseButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Drawer>
  );
};

export default InvitationQrCode;
