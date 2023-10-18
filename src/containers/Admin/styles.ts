import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const dataGridStyles = makeStyles((theme: Theme) => ({
  fullName: {},
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

export const userStyles = makeStyles((theme: Theme) => ({
  qrBox: {},
  qrBoxButtons: {},
  qrBoxContainer: {
    '& $qrBox': {
      '& > div': {
        '& > canvas': {
          display: 'none',
          '&:first-child': {
            display: 'block'
          },
        }
      },
    },
    '& $qrBoxButtons': {
      '& button': {
        padding: theme.spacing(1),
        borderRadius: 100,
      },
    },
    '& .MuiList-root': {
      padding: 0,
      '& .MuiListItem-root': {
        padding: 0,
      },
    },
  },
  accountInfoContainer: {
    '& .MuiList-root': {
      padding: 0,
      '& .MuiListItem-root': {
        padding: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: theme.spacing(2),
        '&:last-child': {
          marginBottom: 0,
        },
        '& .MuiTypography-body1': {
          fontWeight: 600,
          wordBreak: 'break-all',
        },
      },
    },
  }
}));