import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import Report from '../../components/Analytics/Report';
import { RootState } from '../../store/reducers';

const Analytics: React.FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  return (
    <Box p={2}>
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