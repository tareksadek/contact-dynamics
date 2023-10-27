import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const qrStyles = makeStyles((theme: Theme) => ({
  qrContainer: {
    '& > div': {
      '& canvas': {
        display: 'none',
        '&:first-child': {
          display: 'block'
        },
      },
    },
  },
}));