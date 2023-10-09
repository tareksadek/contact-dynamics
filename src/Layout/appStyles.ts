import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const appStyles = makeStyles((theme: Theme) => ({
  mainBox: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    // ... Add other styles as necessary
  },
  // You can also add other classes here, if needed
}));

