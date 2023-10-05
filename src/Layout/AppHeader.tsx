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
  const dispatch = useDispatch<AppDispatch>();
  const submit = useSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { formChanged, formValid } = context;
  const location = useLocation();
  const navigate = useNavigate();

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isQrModalOpen = openModalName === 'qr';

  const getTitleFromPathname = (pathname: string) => {
    switch (pathname) {
      case "/info":
        return "Edit Info";
      case "/about":
        return "Edit About Data";
      case "/theme":
        return "Edit Theme";
      case "/images":
        return "Edit Images";
      case "/links":
        return "Edit Links";
      case "/adminDashboard":
        return "Dashboard";
      case "/batches":
        return "Batches";
      case "/createBatch":
        return "Create New Batch";
      case "/users":
        return "Users";
      default:
        return "Default Title";
    }
  };

  const currentTitle = getTitleFromPathname(location!.pathname);

  const shouldShowSaveButton = (pathname: string) => {
    const pagesWithSaveButton = ["/info", "/about", "/theme", "/images", "/links", "/contactForm", "/redirect"];
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
        <AppBar position="sticky">
          <Toolbar>
            {isLoggedIn && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuButtonClick}>
                <MenuIcon />
              </IconButton>
            )}
            
            {userUrlSuffix && !isProfilePage && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={onBackClick}>
                <ArrowBackIcon />
              </IconButton>
            )}

            {!isProfilePage && (
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                {currentTitle}
              </Typography>
            )}
            
            {isProfilePage ? (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="qr-code"
                style={{
                  marginLeft: 'auto',
                  marginRight: 0
                }}
                onClick={handleQrClick}
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