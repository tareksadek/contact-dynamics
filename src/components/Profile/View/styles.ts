import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const defaultHeaderStyles = makeStyles((theme: Theme) => ({
  imagesContainer: {},
  coverImageContainer: {},
  profileImageContainer: {},
  dataContainer: {},
  headerContainer: {
    '& $imagesContainer': {
      position: 'relative',
      '& $coverImageContainer': {
        borderBottomLeftRadius: theme.spacing(4),
        borderBottomRightRadius: theme.spacing(4),
        margin: '0 auto',
        '& img': {
          display: 'block',
          width: '100%',
          borderBottomLeftRadius: theme.spacing(4),
          borderBottomRightRadius: theme.spacing(4),
        },
      },
      '& $profileImageContainer': {
        position: 'absolute',
        bottom: -50,
        left: 0,
        right: 0,
        top: 'auto',
        margin: 'auto',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
        borderRadius: '50%',
      }
    },
    '& $dataContainer': {

    },
  },
}));

export const businessHeaderStyles = makeStyles((theme: Theme) => ({
  imagesContainer: {},
  coverImageContainer: {},
  profileImageContainer: {},
  dataContainer: {},
  headerContainer: {
    '& $imagesContainer': {
      position: 'relative',
      '& $coverImageContainer': {
        margin: '0 auto',
        clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)',
        '& img': {
          display: 'block',
          width: '100%',
          borderBottomLeftRadius: theme.spacing(4),
          borderBottomRightRadius: theme.spacing(4),
        },
      },
      '& $profileImageContainer': {
        position: 'absolute',
        bottom: 45,
        left: 'auto',
        right: 16,
        top: 'auto',
        margin: 'auto',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
        borderRadius: '50%',
      }
    },
  },
}));

export const cardHeaderStyles = makeStyles((theme: Theme) => ({
  imagesContainer: {},
  coverImageContainer: {},
  profileImageContainer: {},
  dataContainer: {},
  cardContainer: {},
  headerContainer: {
    '& $imagesContainer': {
      position: 'relative',
      '& $coverImageContainer': {
        margin: '0 auto',
        position: 'relative',
        paddingTop: 120,
        '& img': {
          display: 'block',
          width: '100%',
        },
        '& $cardContainer': {
          backgroundColor: theme.palette.background.default,
          boxShadow:' 0px 0px 10px 5px rgba(0, 0, 0, 0.10)',
          borderRadius: theme.spacing(1),
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          width: '80%',
          margin: '0 auto',
          '& $profileImageContainer': {
            backgroundColor: '#fff',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
            borderRadius: '50%',
          },
        },
      },
    },
  },
}));

export const socialHeaderStyles = makeStyles((theme: Theme) => ({
  imagesContainer: {},
  coverImageContainer: {},
  profileImageContainer: {},
  dataContainer: {},
  cardContainer: {},
  headerContainer: {
    '& $imagesContainer': {
      position: 'relative',
      '& $coverImageContainer': {
        margin: '0 auto',
        position: 'relative',
        '& img': {
          display: 'block',
          width: '100%',

        },
        '& $cardContainer': {
          backgroundColor: theme.palette.background.default,
          borderTopRightRadius: theme.spacing(4),
          borderTopLeftRadius: theme.spacing(4),
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          top: -40,
          boxShadow: '0 -7px 7px rgba(0, 0, 0, 15%)',
          '& $profileImageContainer': {
            backgroundColor: '#fff',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
            borderRadius: '50%',
          },
          '& $dataContainer': {
            position: 'relative',
            top: theme.spacing(2)
          }
        },
      },
    },
  },
}));

export const actionButtonsStyles = makeStyles((theme: Theme) => ({
  actionButton: {},
  actionButtonsContainer: {
    '& $actionButton': {
      borderRadius: theme.spacing(8),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      flex: 1,
      color: '#ffffff !important',
      ['@media (max-width:480px)']: {
        fontSize: '0.8rem',
      },
      ['@media (max-width:415px)']: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
      ['@media (max-width:350px)']: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
      },
    },
  },
}));

export const profileInfoStyles = makeStyles((theme: Theme) => ({
  infoContainer: {
    '& .MuiList-root': {
      padding: 0,
      '& .MuiListItem-root': {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        '& .MuiListItemIcon-root': {
          minWidth: 40,
          '& svg': {
            color: theme.palette.background.blue
          }
        },
        '& .MuiListItemText-root': {
          '& a': {
            color: theme.palette.background.reverse,
          },
        },
      },
    },
  },
}));