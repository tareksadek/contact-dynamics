import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import QRCodeStyling from "qr-code-styling";
import { Button } from '@mui/material';
import { appDomain } from '../../setup/setup';

const QrCode: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const qrCodeRef = useRef(null);
  const qrCodeInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (user) {
      const qrData = `${appDomain}/activate?tac=${user.invitationId}_${user.batchId}`;
      qrCodeInstanceRef.current = new QRCodeStyling({
        width: 200,
        height: 200,
        data: qrData,
        dotsOptions: {
          color: '#000000',
          type: 'rounded',
        },
      });

      qrCodeInstanceRef.current.append(qrCodeRef.current);
    }
  }, [user]);

  const downloadAsSVG = () => {
    qrCodeInstanceRef.current.download({
      extension: 'svg',
      name: 'My_Contact_Info'
    });
  };

  const downloadAsPNG = () => {
    qrCodeInstanceRef.current.download({
      extension: 'png',
      name: 'My_Contact_Info'
    });
  };

  return (
    <div>
      <div ref={qrCodeRef}></div>
      <Button variant="contained" color="primary" onClick={downloadAsSVG}>Download as SVG</Button>
      <Button variant="contained" color="secondary" onClick={downloadAsPNG} style={{ marginLeft: '10px' }}>Download as PNG</Button>
    </div>
  );
};

export default QrCode;
