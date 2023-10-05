import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import { appDomain } from '../../setup/setup';
import {
  Button,
  TextField,
  Container,
  Typography,
} from '@mui/material';
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

const ShareProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const sharedLink = user && user.profileUrlSuffix ? `${appDomain}/${user.profileUrlSuffix}` : null;

  const handleCopyToClipboard = () => {
    if (sharedLink) {
      navigator.clipboard.writeText(sharedLink);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Share your profile
      </Typography>

      <TextField
        value={sharedLink || ''}
        fullWidth
        variant="outlined"
        onClick={handleCopyToClipboard}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCopyToClipboard}
        style={{ marginTop: '12px' }}
      >
        Copy Link to Clipboard
      </Button>

      <Typography variant="subtitle1" gutterBottom>
        Share via:
      </Typography>

      {sharedLink && (
        <div style={{ display: 'flex', gap: '12px' }}>
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
        </div>
      )}
    </Container>
  );
};

export default ShareProfile;
