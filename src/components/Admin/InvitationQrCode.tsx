import React, { useRef, useEffect, useState } from 'react';
import { Drawer, Button } from '@mui/material';
import QRCodeStyling from "qr-code-styling";
import { appDomain } from '../../setup/setup';

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
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <div>
        {showQrCode && <div id="qr-container" ref={qrContainerRef} style={{ width: 300, height: 300 }}></div>}
        <Button onClick={() => qrCode.download({
            extension: "svg",
            name: `${invitationId}_${batchId}`
        })}>Save as SVG</Button>

        <Button onClick={() => qrCode.download({
            extension: "png",
            name: `${invitationId}_${batchId}`
        })}>Save as PNG</Button>

      </div>
    </Drawer>
  );
};

export default InvitationQrCode;
