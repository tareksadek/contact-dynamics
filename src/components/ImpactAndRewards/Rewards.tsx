import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Typography, Button, Drawer } from '@mui/material';
import { Milestone } from '../../types/setup';
import { layoutStyles } from '../../theme/layout';
import { rewardStyles } from './styles';

type RewardsProps = {
  visits: number;
  rewardsMilestones: Milestone[];
};

const Rewards: React.FC<RewardsProps> = ({ visits, rewardsMilestones }) => {
  const theme = useTheme()
  const classes = rewardStyles()
  const layoutClasses = layoutStyles()
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
  };

  const handleCloseDrawer = () => {
    setSelectedMilestone(null);
  };

  const formatPercentage = (value: number): string => {
    return value % 1 === 0 ? `${value.toFixed(0)}%` : `${value.toFixed(2)}%`;
  };

  return (
    <Box>
      <Typography variant="body1">Rewards for reaching environmental milestones</Typography>
      {rewardsMilestones.map((milestone, index) => {
        const percentage = Math.min(100, (visits / milestone.goal) * 100); // Ensure percentage does not exceed 100

        return (
          <Box
            key={index}
            onClick={visits >= milestone.goal ? () => handleMilestoneClick(milestone) : undefined}
            style={visits >= milestone.goal ? { cursor: 'pointer' } : {}}
            p={4}
            mt={2}
            className={layoutClasses.panel}
          >
            <Typography variant="body1" align='center'>{milestone.title}</Typography>
            <Box className={classes.rewardChartContainer} width={100} height={100} mt={2}>
              <Typography variant="body1" className={classes.rewardPercentage}>{formatPercentage(percentage)}</Typography>
              <PieChart width={100} height={100}>
                <Pie
                  data={[{ value: percentage }, { value: 100 - percentage }]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  strokeWidth={0}
                  fill={theme.palette.background.grey}
                >
                  <Cell key="completed" fill={theme.palette.background.green} />
                  <Cell fill={theme.palette.background.grey} />
                </Pie>
              </PieChart>
            </Box>
            {percentage >= 10 && (
              <Box width="100%" mt={2}>
                <Button variant="contained" color="primary" fullWidth>Claim reward</Button>
              </Box>
            )}
          </Box>
        );
      })}

      <Drawer anchor="bottom" open={!!selectedMilestone} onClose={handleCloseDrawer}>
        {selectedMilestone && (
          <Box p={2}>
            <Typography variant="h6">{selectedMilestone.description}</Typography>
            {selectedMilestone.code && <Typography>Code: {selectedMilestone.code}</Typography>}
            {selectedMilestone.link && <Button href={selectedMilestone.link}>Click here</Button>}
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

export default Rewards;
