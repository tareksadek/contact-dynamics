import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';

type EfficiencyProps = {
  contacts: number;
  visits: number;
  addedToContacts: number;
};

const EfficiencyReport: React.FC<EfficiencyProps> = ({ contacts, visits, addedToContacts }) => {
  let efficiencyPercentage = ((contacts + (addedToContacts * 0.5)) / visits) * 100;
  
  efficiencyPercentage = Math.min(efficiencyPercentage, 100);

  const displayEfficiency = Number.isInteger(efficiencyPercentage) ? `${Math.round(efficiencyPercentage)}%` : `${efficiencyPercentage.toFixed(1)}%`;


  return (
    <Box p={3} border={1} borderColor="divider" borderRadius={2}>
      <Typography variant="h6">Efficiency Report</Typography>
      <Box mt={2}>
        <Typography>Contacts: {contacts}</Typography>
        <Typography>Added to Contacts: {addedToContacts}</Typography>
        <Typography>Visits: {visits}</Typography>
      </Box>
      {(visits < 1 || addedToContacts < 1 || contacts < 1) ? (
        <div>
          No enough data to create the efficiency chart
        </div>
      ) : (
        <>
          <PieChart width={200} height={200}>
            <Pie
              data={[{ value: efficiencyPercentage }, { value: 100 - efficiencyPercentage }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={50}
              fill="#82ca9d"
            >
              <Cell key="efficiency" fill="#82ca9d" />
              <Cell key="rest" fill="#d0ed57" />
            </Pie>
          </PieChart>
          <Typography
            variant="h5"
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {displayEfficiency}
          </Typography>
        </>
      )}

    </Box>
  );
};

export default EfficiencyReport;