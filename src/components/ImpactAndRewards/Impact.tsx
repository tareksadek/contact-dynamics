import React from 'react';
import { Box, Typography, Paper, Icon } from '@mui/material';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

type ImpactProps = {
  visits: number;
};

const Impact: React.FC<ImpactProps> = ({ visits }) => {

  const calculateGreenhouseGasesSaved = (visitsNumber: number) => {
    const gramsPerCard = 20;
    const gramsPerKilogram = 1000;
    const kilogramsPerTon = 1000;
    const gramsSaved = visitsNumber * gramsPerCard;
    const kilogramsSaved = gramsSaved / gramsPerKilogram;
    const tonsSaved = kilogramsSaved / kilogramsPerTon;
    const co2PerTon = 1.4 * 1000 * 1000; 
    const co2Saved = tonsSaved * co2PerTon;
    return Number(co2Saved.toFixed(2));
  }

  const calculateTreesSaved = (visitsNumber: number) => {
    const cardsPerTree = (24 * 1000) / 10; 
    const treesSaved = visitsNumber / cardsPerTree
    return parseFloat(treesSaved.toFixed(2));
  }

  const calculateWaterSaved = (visitsNumber: number) => {
    const litersPerTon = 10000;
    const paperWeight = 0.007;
    const paperSaved = (visitsNumber * paperWeight) / 1000;
    const waterSaved = paperSaved * litersPerTon;
    return parseFloat(waterSaved.toFixed(2));
  }

  return (
    <Box>
      {[
        { title: 'Saved Cards', value: visits, icon: <EnergySavingsLeafIcon /> },
        { title: 'Greenhouse Gases Reduced', value: calculateGreenhouseGasesSaved(visits), icon: <EnergySavingsLeafIcon /> },
        { title: 'Trees Saved', value: calculateTreesSaved(visits), icon: <EnergySavingsLeafIcon /> },
        { title: 'Water Saved', value: calculateWaterSaved(visits), icon: <EnergySavingsLeafIcon /> }
      ].map((data, index) => (
        <Paper key={index} style={{ padding: 15, marginBottom: 20 }}>
          <Icon>{data.icon}</Icon>
          <Typography variant="h6">{data.title}</Typography>
          <Typography variant="h4">{data.value}</Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default Impact;
