import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const appStyles = makeStyles((theme: Theme) => ({
  mainBox: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(10),
    }
  },
  contentContainer: {
    maxWidth: '550px !important',
    paddingTop: theme.spacing(2),
  }
}));

export const appHeaderStyles = makeStyles((theme: Theme) => ({
  appBarButtons: {},
  appBarRoot: {
    backgroundColor: `${theme.palette.background.default} !important`,
    backgroundImage: 'none !important',
    boxShadow: ' 0 0 0 transparent !important',
    maxWidth: 550,
    margin: '0 auto',
    '& $appBarButtons': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.background.headerButtons,
    },
  },
}));

export const sideMenuStyles = makeStyles((theme: Theme) => ({
  sideMenuPaper: {
    width: 230,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  switchButton: {},
  switchButtonsContainer: {
    '& $switchButton': {
      borderRadius: 100,
      marginBottom: theme.spacing(1),
      width: '100%',
      textTransform: 'initial',
      padding: theme.spacing(1),
    },
  },
  switchDialogButton: {
    '& .MuiListItemText-root': {
      textTransform: 'capitalize',
    },
  },
  accordionRoot: {},
  accordionSummaryRoot: {},
  menuLinksList: {
    '& $accordionSummaryRoot': {
      padding: 0,
      '& .MuiAccordionSummary-content': {
        marginTop: 0,
        marginBottom: 0,
        '& .MuiListItemText-root': {
          '& .MuiTypography-root': {
            textTransform: 'capitalize',
            fontWeight: 600,
          },
        }
      },
      '& .MuiAccordionSummary-expandIconWrapper': {
        color: theme.palette.background.accordionIcon,
      },
      '& .Mui-expanded': {
        minHeight: 30,
      },
    },
    '& $accordionRoot': {
      boxShadow: '0 0 0 transparent',
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      '&:before': {
        backgroundColor: 'transparent',
      },
      '& .MuiCollapse-root': {
        '& .MuiAccordionDetails-root': {
          padding: 0,
          '& .MuiList-root': {
            padding: 0,
            '& .MuiButtonBase-root': {
              paddingLeft: 0,
              paddingRight: 0,
              '& .MuiListItemIcon-root': {
                color: theme.palette.background.accordionButtonIcon,
                minWidth: 30,
              },
              '& .MuiListItemText-root': {
                textTransform: 'capitalize',
              },
              '&.Mui-selected': {
                backgroundColor: 'transparent',
                '& .MuiListItemIcon-root': {
                  color: theme.palette.background.accordionButtonIconSelected,
                },
              },
              '&:hover': {
                backgroundColor: 'transparent',
              },
            },
          },
        },
      },
      '& .MuiAccordionSummary-root': {
        backgroundColor: 'transparent',
        border: 'none',
      },
      '& .MuiAccordionDetails-root': {
        backgroundColor: 'transparent',
      },
    },
    '& .MuiButtonBase-root': {
      paddingLeft: 0,
      paddingRight: 0,
      '& .MuiListItemIcon-root': {
        color: theme.palette.background.accordionButtonIcon,
        minWidth: 30,
      },
      '& .MuiListItemText-root': {
        textTransform: 'capitalize',
      },
      '&.Mui-selected': {
        backgroundColor: 'transparent',
        '& .MuiListItemIcon-root': {
          color: theme.palette.background.accordionButtonIconSelected,
        },
      },
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
  
}));

