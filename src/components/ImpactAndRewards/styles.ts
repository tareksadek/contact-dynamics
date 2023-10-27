import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const impactStyles = makeStyles((theme: Theme) => ({
  impactSectionData: {},
  impactSection: {
    '& $impactSectionData': {
      '& .MuiTypography-body1': {
        fontSize: '1.5rem',
        fontWeight: 600,
        '& span': {
          color: theme.palette.background.reverse,
          fontSize: '0.75rem',
          fontWeight: 400,
          marginLeft: theme.spacing(0.5),
        },
      },
    },
  },
}));

export const rewardStyles = makeStyles((theme: Theme) => ({
  rewardPercentage: {},
  rewardChartContainer: {
    position: 'relative',
    margin: '0 auto',
    '& $rewardPercentage': {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 100,
      textAlign: 'center',
      margin: 'auto',
      height: 20,
    },
  },
}));