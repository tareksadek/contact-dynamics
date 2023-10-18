import React, { useEffect, ReactNode, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Theme } from '@mui/material/styles';
import { Box } from '@mui/material';
import AppHeader from './AppHeader';
import AppContentContainer from './AppContentContainer';
import AppSideMenu from './AppSideMenu';
import { RootState } from '../store/reducers';
import { useLocation } from 'react-router-dom';
import { openModal, closeMenu } from '../store/actions/modal';
import ProfileSwitcherDialog from './ProfileSwitcherDialog';
import { appStyles } from './appStyles';
import { useTheme } from '../contexts/ThemeContext';

interface AppLayoutProps {
  children: ReactNode;
  theme?: Theme;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, theme }) => {
  const classes = appStyles();
  const dispatch = useDispatch();  
  const { setSpecificTheme } = useTheme();

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const profile = useSelector((state: RootState) => state.profile.profile);

  const isSideMenuOpen = openModalName === 'sideMenu';

  const currentUser = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);
  const isDefaultProfile = currentUser && (!currentUser.profileList || currentUser.profileList.length > 0) && !currentUser.activeProfileId;

  const location = useLocation();

  const isProfilePage = !!currentUser && location.pathname.slice(1) === currentUser.profileUrlSuffix;

  const handlePopState = useCallback((event: PopStateEvent) => {
    if (openModalName) {
        dispatch(closeMenu());
        event.preventDefault();
    }
  }, [openModalName, dispatch]);

  useEffect(() => {
      if (openModalName) {
          window.history.pushState(null, "", window.location.pathname);
          window.addEventListener("popstate", handlePopState);
      }
      return () => {
          window.removeEventListener("popstate", handlePopState);
      };
  }, [openModalName, handlePopState]);

  useEffect(() => {
    if (profile && profile.themeSettings) {            
      setSpecificTheme(profile.themeSettings.theme)
    }
  }, [profile]);
 

  const toggleDrawer = useCallback(() => {
    if (isSideMenuOpen) {
      dispatch(closeMenu());
    } else {
      dispatch(openModal('sideMenu'));
    }
  }, [dispatch, isSideMenuOpen]);

  const shouldHideHeader = () => {
    const pagesWithoutHeader = ["/login", "/createAccount"];
    return pagesWithoutHeader.includes(location!.pathname);
  };    

  return (
    <Box className={classes.mainBox}>
      {!isDefaultProfile && !shouldHideHeader() && (
        <AppHeader
          userUrlSuffix={currentUser ? currentUser.profileUrlSuffix : null}
          isProfilePage={isProfilePage}
          isLoggedIn={isLoggedIn}
          onMenuButtonClick={toggleDrawer}
        />
      )}

      <AppContentContainer>
        {children}
      </AppContentContainer>

      {isLoggedIn && (
        <AppSideMenu
          isOpen={isSideMenuOpen}
          toggleDrawer={toggleDrawer}
        />
      )}

      {isLoggedIn && (
        <ProfileSwitcherDialog />
      )}
    </Box>
  );
}

export default AppLayout;
