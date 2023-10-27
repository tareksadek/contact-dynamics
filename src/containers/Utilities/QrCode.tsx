import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import QRCodeStyling from "qr-code-styling";
import { Button, Box } from '@mui/material';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { appDomain } from '../../setup/setup';
import { qrStyles } from './style';

const QrCode: React.FC = () => {
  const classes = qrStyles()
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
    <Box
      p={2}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box className={classes.qrContainer}>
        <div ref={qrCodeRef}></div>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={2}
        mt={2}
        minWidth={200}
      >
        <Button variant="contained" color="primary" onClick={downloadAsSVG} startIcon={<DownloadForOfflineIcon />} fullWidth>SVG</Button>
        <Button variant="contained" color="secondary" onClick={downloadAsPNG} startIcon={<DownloadForOfflineIcon />} fullWidth>PNG</Button>
      </Box>
    </Box>
  );
};

export default QrCode;
