import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import { appDomain } from '../../setup/setup';
import {
  Button,
  TextField,
  Typography,
  Box,
  Chip
} from '@mui/material';
import SignalWifiConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiConnectedNoInternet4';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import { useTheme } from '@mui/material';

const ShareProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const theme =  useTheme()

  const sharedLink = user && user.profileUrlSuffix ? `${appDomain}/${user.profileUrlSuffix}` : null;

  const handleCopyToClipboard = () => {
    if (sharedLink) {
      navigator.clipboard.writeText(sharedLink);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Box p={2}>
      <Box width="100%">
        <Typography variant="body1">
          Card URL
        </Typography>

        <TextField
          value={sharedLink || ''}
          fullWidth
          variant="outlined"
          onClick={handleCopyToClipboard}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCopyToClipboard}
            fullWidth
          >
            Copy Link to Clipboard
          </Button>
        </Box>
      </Box>

      <Box mt={2}>
        <Box
          mb={1}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Typography variant="body1">
            Share
          </Typography>
          <Chip icon={<SignalWifiConnectedNoInternet4Icon />} size="small" label="Device Offline" style={{
            background: theme.palette.background.danger
          }} />
        </Box>

        {sharedLink && (
          <Box display="flex" alignItems="center" justifyContent="flex-start" gap={2}>
            <EmailShareButton url={sharedLink} subject="Check out my profile">
              <EmailIcon size={32} round />
            </EmailShareButton>

            <FacebookShareButton url={sharedLink}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <TwitterShareButton url={sharedLink} title="Check out my profile">
              <TwitterIcon size={32} round />
            </TwitterShareButton>

            <LinkedinShareButton url={sharedLink} title="Check out my profile">
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>

            <WhatsappShareButton url={sharedLink} title="Check out my profile">
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ShareProfile;
