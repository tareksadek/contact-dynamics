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

  avatar: {},
  teamsChip: {},
  noHeaderGrid: {},
  gridContainer: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '&$noHeaderGrid': {
      '& .MuiDataGrid-columnHeaders': {
        display: 'none',
      },
    },
    '& $fullName': {
      textTransform: 'capitalize',
    },
    '& $avatar': {
      backgroundColor: theme.palette.background.avatar,
      color: theme.palette.background.reverse,
      fontSize: '0.8rem',
      textTransform: 'capitalize',
    },
    '& $teamsChip': {
      backgroundColor: theme.palette.background.green,
      color: '#fff',
    },
  },
}));