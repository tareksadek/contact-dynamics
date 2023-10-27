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
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  stickyBottomBox: {
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    zIndex: 2,
    opacity: 0,
    animation: `$fadeIn 0.5s forwards`,
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
  panel: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.panel,
  }
}));
