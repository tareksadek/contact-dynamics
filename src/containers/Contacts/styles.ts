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

export const contactFormStyles = makeStyles((theme: Theme) => ({
  formOptionContainer: {},
  forOptionImageContainer: {},
  formSelectContainer: {
    '& .MuiFormGroup-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(7),
      '& .MuiFormControlLabel-root': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: 0,
        '& .MuiButtonBase-root': {
          display: 'none',
          '&.Mui-checked': {
            display: 'block',
            position: 'absolute',
            right: -16,
            top: -16,
          },
        },
        '& $formOptionContainer': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          '& $forOptionImageContainer': {
            width: 100,
            height: 100,
            backgroundColor: theme.palette.background.formOption,
            borderRadius: theme.spacing(1),
            padding: theme.spacing(2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing(1),
          }
        }
      }
    },
  },
}));