import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer } from "@mui/material";
import ProfileSwitcher from "./ProfileSwitcher";
import { RootState } from '../store/reducers';
import { defaultMenu, teamMasterMenu, teamMemberMenu, adminMenu } from '../setup/setup';
import MenuLinks from './MenuLinks';

type AppSideMenuProps = {
  isOpen: boolean;
  toggleDrawer: () => void;
};

type LinkType = {
  linkfor: string;
  path: string;
};

type MenuType = {
  title: string | null;
  links: LinkType[];
};

const AppSideMenu: React.FC<AppSideMenuProps> = ({ isOpen, toggleDrawer }) => {
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const currentUser = useSelector((state: RootState) => state.user.user);

  const filterMenu = (menu: MenuType[], linkFor: string): MenuType[] => {
    return menu.map(menuItem => {
      if (!menuItem.title) return menuItem;
      return {
        ...menuItem,
        links: menuItem.links.filter((link: LinkType) => link.linkfor !== linkFor),
      };
    });
  };

  let currentMenu = [...defaultMenu];

  if (appSetup?.themeSettings) {
    // If themeSettings exists, filter out the theme link
    currentMenu = filterMenu(currentMenu, 'theme');
  }
  if (appSetup?.redirect) {
    // If redirect exists, filter out the redirect link
    currentMenu = filterMenu(currentMenu, 'redirect');
  }

  if (currentUser?.isTeamMaster) {
    currentMenu = teamMasterMenu;
  } else if (currentUser?.isTeamMember) {
    currentMenu = teamMemberMenu
  } else if (currentUser?.isAdmin) {
    currentMenu = adminMenu
  }

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
      {(!currentUser?.isTeamMaster && !currentUser?.isTeamMember) && appSetup?.withMultipleProfiles && (
        <ProfileSwitcher onCloseMenu={toggleDrawer} />
      )}
      <MenuLinks menu={currentMenu} onCloseMenu={toggleDrawer} />
    </Drawer>
  );
}

export default React.memo(AppSideMenu);
