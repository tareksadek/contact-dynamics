import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import About from '../About';
import ActionButtons from '../ActionButtons';
import SocialLinks from '../SocialLinks';
import CustomLinks from '../CustomLinks';
import Video from '../Video';
import Info from '../Info';

const Layout: React.FC<{ profile: any }> = ({ profile }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Header />

      <Box mt={2} mb={2} width="100%">
        <About />
      </Box>

      <Box mt={2} mb={2} width="100%">
        <ActionButtons
          buttonStyles={{
            layout: 'divided',
            buttonStyle: 'rounded'
          }}
        />
      </Box>

      <Box mt={2} mb={2} width="100%">
        <SocialLinks
          linksStyles={{
            socialLinksStyle: 'rounded',
          }}
        />
      </Box>

      <Box mt={2} mb={2} width="100%">
        <CustomLinks />
      </Box>

      <Box mt={2} mb={2} width="100%">
        <Video />
      </Box>

      <Box mt={2} width="100%">
        <Info />
      </Box>
    </Box>
  );
};

export default Layout;
