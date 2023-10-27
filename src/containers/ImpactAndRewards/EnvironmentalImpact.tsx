import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import { Box } from '@mui/material';
import Impact from '../../components/ImpactAndRewards/Impact';
import Rewards from '../../components/ImpactAndRewards/Rewards';

const EnvironmentalImpact: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const appSetup = useSelector((state: RootState) => state.setup.setup);

  return (
    <Box mb={2} p={2}>
      <Box mb={2}>
        <Impact visits={user?.visits || 0} />
      </Box>
      {appSetup && appSetup?.rewardsMilestones && appSetup?.rewardsMilestones.length > 0 && (
        <Box mt={4}>
          <Rewards visits={user?.visits || 0} rewardsMilestones={appSetup?.rewardsMilestones || []} />
        </Box>
      )}
    </Box>
  );
}

export default EnvironmentalImpact;
