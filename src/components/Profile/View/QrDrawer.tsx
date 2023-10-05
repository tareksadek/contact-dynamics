import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '@mui/material';
import QRCodeStyling from "qr-code-styling";
import { appDomain } from '../../../setup/setup';
import { RootState } from '../../../store/reducers';

interface InvitationQrCodeProps {
  open: boolean;
  onClose: () => void;
}

const qrCode = new QRCodeStyling({
  width: 200,
  height: 200,
  dotsOptions: {
    color: '#000000',
    type: 'rounded',
  },
});

const QrDrawer: React.FC<InvitationQrCodeProps> = ({ open, onClose }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [showQrCode, setShowQrCode] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => {
        setShowQrCode(true);
      }, 300);
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
      const newData = `${appDomain}/${user?.profileUrlSuffix}`;
      qrCode.update({ data: newData });
    }
  }, [open, showQrCode, user?.profileUrlSuffix]);

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
        {showQrCode && <div id="qr-container" ref={qrContainerRef} style={{ width: 300, height: 300 }}></div>}
      </div>
    </Modal>
  );
};

export default QrDrawer;
