import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import { Container, Grid } from '@mui/material';
import Impact from '../../components/ImpactAndRewards/Impact';
import Rewards from '../../components/ImpactAndRewards/Rewards';

const EnvironmentalImpact: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const appSetup = useSelector((state: RootState) => state.setup.setup);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Impact visits={user?.visits || 0} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Rewards visits={user?.visits || 0} rewardsMilestones={appSetup?.rewardsMilestones || []} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default EnvironmentalImpact;
