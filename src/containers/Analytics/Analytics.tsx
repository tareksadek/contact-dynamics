import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Report from '../../components/Analytics/Report';
import { RootState } from '../../store/reducers';

const Analytics: React.FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Analytics</Typography>
      <Typography variant="body1" mb={3}>
        A detailed report about your digital card's performance.
      </Typography>
      <Report
        sections={{
          efficiency: true,
          visits: true,
          links: true
        }}
        contacts={profile?.contacts || 0}
        visits={profile?.visits || 0}
        addedToContacts={profile?.addedToContacts || 0}
        links={profile?.links || null}
      />
    </Box>
  );
};

export default Analytics;