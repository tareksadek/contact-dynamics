import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const dataGridStyles = makeStyles((theme: Theme) => ({
  fullName: {},
  avatar: {},
  gridContainer: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '& .MuiDataGrid-columnHeaders': {
      display: 'none',
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
    '& .MuiDataGrid-row': {
    }
  },
}));