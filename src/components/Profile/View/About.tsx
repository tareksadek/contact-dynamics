import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { RootState } from '../../../store/reducers';

const About: React.FC = () => {
  const setup = useSelector((state: RootState) => state.setup.setup);
  const profile = useSelector((state: RootState) => state.profile.profile);

  let aboutData;

  if (setup && setup.aboutData && setup.aboutData.about) {
    aboutData = setup.aboutData.about;
  } else if (profile && profile.aboutData && profile.aboutData.about) {
    aboutData = profile.aboutData.about;
  }

  if (aboutData) {
    return (
      <Box pl={1} pr={1}>
        <Typography variant="body1" align="center" style={{ fontSize: '0.75rem', lineHeight: '1.4rem' }}>
          {aboutData}
        </Typography>
      </Box>
    );
  }
  return null
};

export default About;
