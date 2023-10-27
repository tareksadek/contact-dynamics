import React from 'react';
import {
  Typography,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';
import { analyticsStyles } from './styles';

type EfficiencyProps = {
  contacts: number;
  visits: number;
  addedToContacts: number;
};

const EfficiencyReport: React.FC<EfficiencyProps> = ({ contacts, visits, addedToContacts }) => {
  const theme = useTheme()
  const classes = analyticsStyles()
  let efficiencyPercentage = ((contacts + (addedToContacts * 0.5)) / visits) * 100;
  
  efficiencyPercentage = Math.min(efficiencyPercentage, 100);

  const displayEfficiency = Number.isInteger(efficiencyPercentage) ? `${Math.round(efficiencyPercentage)}%` : `${efficiencyPercentage.toFixed(1)}%`;

  return (
    <Box>
      <Box pb={2} className={classes.efficiencyBoxContainer}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography variant="body1" align="left">Card Efficiency</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box p={2}>
              {(visits < 1 || addedToContacts < 1 || contacts < 1) ? (
                <Alert severity="warning">No enough data to create the efficiency chart.</Alert>
              ) : (
                <Box className={classes.efficiencyChartContainer} width={100} height={100}>
                  <PieChart width={100} height={100}>
                    <Pie
                      data={[{ value: efficiencyPercentage }, { value: 100 - efficiencyPercentage }]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      strokeWidth={0}
                      fill={theme.palette.background.grey}
                    >
                      <Cell key="efficiency" fill={theme.palette.background.blue} />
                      <Cell key="rest" fill={theme.palette.background.grey} />
                    </Pie>
                  </PieChart>
                  <Typography variant="body1" className={classes.efficiencyPercentage}>{displayEfficiency}</Typography>
                </Box>
              )}
            </Box>
            <Box mt={2} mb={1} display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" gap={2}>
              <Box className={classes.efficiencyNumberContainer}>
                <Typography variant="body1" align='center'>{contacts}</Typography>
                <Typography variant="body1" align='center'>Contacts</Typography>
              </Box>
              <Box className={classes.efficiencyNumberContainer}>
                <Typography variant="body1" align='center'>{addedToContacts}</Typography>
                <Typography variant="body1" align='center'>Added to Contacts</Typography>
              </Box>
              <Box className={classes.efficiencyNumberContainer}>
                <Typography variant="body1" align='center'>{visits}</Typography>
                <Typography variant="body1" align='center'>Visits</Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default EfficiencyReport;