import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Slide
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeIcon from "@mui/icons-material/QrCode";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useSubmit, SubmitContext } from '../contexts/SubmitContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrDrawer from '../components/Profile/View/QrDrawer';
import { RootState, AppDispatch } from '../store/reducers';
import { openModal, closeMenu } from '../store/actions/modal';
import { appHeaderStyles } from './appStyles';

type AppHeaderProps = {
  userUrlSuffix: string | null;
  isProfilePage: boolean;
  isLoggedIn: boolean;
  onMenuButtonClick: () => void;
};

type HideOnScrollProps = {
  children: React.ReactElement;
};

const HideOnScroll: React.FC<HideOnScrollProps> = (props) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children}
    </Slide>
  );
}

const AppHeader: React.FC<AppHeaderProps> = ({
  userUrlSuffix,
  isProfilePage,
  isLoggedIn,
  onMenuButtonClick,
}) => {
  const classes = appHeaderStyles()
  const dispatch = useDispatch<AppDispatch>();
  const submit = useSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { formChanged, formValid } = context;
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.users.selectedUser);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isQrModalOpen = openModalName === 'qr';

  const getTitleFromPathname = (pathname: string) => {
    const userRegex = /^\/users\/[^/]+$/; // Matches /users/:userId
    const userContactsRegex = /^\/users\/[^/]+\/contacts$/; // Matches /users/:userId/contacts
    const userAnalyticsRegex = /^\/users\/[^/]+\/analytics$/; // Matches /users/:userId/analytics

    if (userRegex.test(pathname)) {
      return user && user.fullName ? user.fullName : "User Details";
    } else if (userContactsRegex.test(pathname)) {
      return user && user.fullName ? `${user.fullName} Contacts` : "User Contacts";
    } else if (userAnalyticsRegex.test(pathname)) {
      return user && user.fullName ? `${user.fullName} Analytics` : "User Contacts";
    }

    switch (pathname) {
      case "/info":
        return "Info";
      case "/about":
        return "About";
      case "/theme":
        return "Theme";
      case "/images":
        return "Images";
      case "/links":
        return "Links";
      case "/contacts":
        return "Contacts";
      case "/efficiency":
        return "Digital Card Report";
      case "/adminDashboard":
        return "Dashboard";
      case "/batches":
        return "Batches";
      case "/createBatch":
        return "Create New Batch";
      case "/users":
        return "Users";
      case "/users/:userId":
        return user && user.fullName ? user.fullName : "User Details";
      default:
        return "Default Title";
    }
  };

  const currentTitle = getTitleFromPathname(location!.pathname);

  const shouldShowSaveButton = (pathname: string) => {
    // const pagesWithSaveButton = ["/info", "/about", "/theme", "/images", "/links", "/contactForm", "/redirect"];
    const pagesWithSaveButton = ["/dummyPage"]
    return pagesWithSaveButton.includes(pathname);
  };

  const onBackClick = () => {
    navigate(`/${userUrlSuffix}`)
  }

  const handleQrClick = () => {
    dispatch(openModal('qr'));
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="sticky"
          classes={{
            root: classes.appBarRoot
          }}
        >
          <Toolbar>
            {userUrlSuffix && !isProfilePage && (
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={onBackClick}
                className={classes.appBarButtons}
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            {!isProfilePage && (
              <Typography variant="body1" style={{ flexGrow: 1, textTransform: 'capitalize' }}>
                {currentTitle}
              </Typography>
            )}

            {isProfilePage ? (
              <IconButton
                edge="end"
                aria-label="qr-code"
                style={{
                  marginLeft: 'auto',
                  marginRight: 0
                }}
                onClick={handleQrClick}
                className={classes.appBarButtons}
              >
                <QrCodeIcon />
              </IconButton>
            ) : shouldShowSaveButton(location!.pathname) && (
              <Button
                color="inherit"
                onClick={submit}
                disabled={!formChanged || !formValid}
              >
                Save
              </Button>
            )}

            {isLoggedIn && (
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={onMenuButtonClick}
                className={classes.appBarButtons}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <QrDrawer
        open={isQrModalOpen}
        onClose={() => dispatch(closeMenu())}
      />
    </>
  );
}

export default AppHeader;