import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const layoutStyles = makeStyles((theme: Theme) => ({
  drawerCloseButton: {},
  radiusBottomDrawer: {
    borderTopLeftRadius: theme.spacing(4),
    borderTopRightRadius: theme.spacing(4),
    '& $drawerCloseButton': {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(2),
    },
  },
  stickyBottomBox: {
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '& button': {
      flex: 1,
    },
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      left: 0,
      padding: theme.spacing(2),
    },
  },
}));
