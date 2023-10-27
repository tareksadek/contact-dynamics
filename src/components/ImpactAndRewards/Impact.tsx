import React from 'react';
import { Box, Typography } from '@mui/material';
import { impactStyles } from './styles';
import { layoutStyles } from '../../theme/layout';

type ImpactProps = {
  visits: number;
};

const Impact: React.FC<ImpactProps> = ({ visits }) => {
  const classes = impactStyles()
  const layoutClasses = layoutStyles()
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
      <Typography variant="body1">The environmental impact of using your digital card</Typography>
      {[
        { title: 'Saved Cards', value: visits, icon: 'card.svg' },
        { title: 'Greenhouse Gases Reduced', value: calculateGreenhouseGasesSaved(visits), icon: 'greenHouse.svg', unit: 'GMs' },
        { title: 'Trees Saved', value: calculateTreesSaved(visits), icon: 'trees.svg' },
        { title: 'Water Saved', value: calculateWaterSaved(visits), icon: 'water.svg', unit: 'Liters' }
      ].map((data, index) => (
        <Box
          key={index}
          p={2}
          mt={2}
          className={layoutClasses.panel}
        >
          <Box
            className={classes.impactSection}
            p={1}
            gap={4}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Box>
              <img src={`/assets/images/${data.icon}`} alt={data.title} />
            </Box>
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              flexDirection="column"
              className={classes.impactSectionData}
            >
              <Typography variant="body1">
                {data.value}
                {data.unit && (
                  <span>{data.unit}</span>
                )}
              </Typography>
              <Typography variant="body2">{data.title}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Impact;
