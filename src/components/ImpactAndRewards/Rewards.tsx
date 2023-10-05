import React, { useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Typography, Paper, Button, Drawer } from '@mui/material';
import { Milestone } from '../../types/setup';

type RewardsProps = {
  visits: number;
  rewardsMilestones: Milestone[];
};

const Rewards: React.FC<RewardsProps> = ({ visits, rewardsMilestones }) => {
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
      <Typography variant="h4">Rewards</Typography>
      {rewardsMilestones.map((milestone, index) => {
        const percentage = Math.min(100, (visits / milestone.goal) * 100); // Ensure percentage does not exceed 100

        return (
          <Paper
            key={index}
            onClick={visits >= milestone.goal ? () => handleMilestoneClick(milestone) : undefined}
            style={visits >= milestone.goal ? { cursor: 'pointer' } : {}} // Change cursor style if clickable
          >
            <Typography variant="h6">{milestone.title}</Typography>
            <Typography variant="subtitle2">{formatPercentage(percentage)} completed</Typography>
            <PieChart width={200} height={200}>
              <Pie
                data={[{ value: percentage }, { value: 100 - percentage }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={50}
                innerRadius={25}
              >
                <Cell fill="#82ca9d" />
                <Cell fill="#d0ed57" />
              </Pie>
            </PieChart>
            {percentage >= 100 && <Button>Claim reward</Button>}
          </Paper>
        );
      })}

      <Drawer anchor="bottom" open={!!selectedMilestone} onClose={handleCloseDrawer}>
        {/* Render the selected milestone details here */}
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
