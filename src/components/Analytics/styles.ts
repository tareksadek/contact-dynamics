import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const analyticsStyles = makeStyles((theme: Theme) => ({
  efficiencyChartContainer: {},
  efficiencyNumberContainer: {},
  efficiencyPercentage: {},
  efficiencyBoxContainer: {
    '& $efficiencyChartContainer': {
      position: 'relative',
      margin: '0 auto',
      '& $efficiencyPercentage': {
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
    '& $efficiencyNumberContainer': {
      '& .MuiTypography-body1': {
        '&:first-child': {
          fontSize: '1.5rem',
          color: theme.palette.background.blue,
          fontWeight: 600,
        },
        '&:last-child': {
          color: theme.palette.background.secondaryText,
        },
      },
    },
  },
  linksList: {},
  linkClicksContainer: {},
  linkClicks: {},
  link: {},
  linksContainer: {
    '& $linksList': {
      '& $linkClicksContainer': {
        '& $linkClicks': {
          fontSize: '1.5rem',
          color: theme.palette.background.blue,
          fontWeight: 600,
          '& span': {
            color: theme.palette.background.reverse,
            fontSize: '0.75rem',
            fontWeight: 400,
            marginLeft: theme.spacing(0.5),
          },
        },
        '& $link': {
          color: theme.palette.background.secondaryText,
          position: 'relative',
          top: -4,
          '& .MuiTypography-body1': {
            color: theme.palette.background.secondaryText,
          },
        },
      },
    },
  },
  totalVisits: {},
  lineChartContainer: {},
  visitsContainer: {
    '& $totalVisits': {
      '& .MuiTypography-body1': {
        '&:first-child': {
          fontSize: '1.5rem',
          color: theme.palette.background.blue,
          fontWeight: 600,
        },
        '&:last-child': {
          color: theme.palette.background.secondaryText,
        },
      },
    },
    '& $lineChartContainer': {
      marginLeft: -16
    }
  }
}));