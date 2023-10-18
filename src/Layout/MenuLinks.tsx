import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, List, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { defaultMenu, teamMasterMenu, teamMemberMenu, adminMenu } from '../setup/setup';
import MenuLinkIcon from './MenuLinkIcon';
import { sideMenuStyles } from './appStyles';

type MenuLinkProps = {
  menu: typeof defaultMenu | typeof teamMasterMenu | typeof teamMemberMenu | typeof adminMenu;
  onCloseMenu: () => void;
};

const MenuLinks: React.FC<MenuLinkProps> = ({ menu, onCloseMenu }) => {
  const classes = sideMenuStyles()
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <List className={classes.menuLinksList}>
      {menu.map((item, index) => {
        if (item.title === null) {
          return (
            <ListItemButton
              key={index}
              onClick={() => {
                navigate(item.links[0].path);
                onCloseMenu();
              }}
              selected={location.pathname === item.links[0].path}
            >
              <ListItemIcon>
                <MenuLinkIcon linkfor={item.links[0].linkfor} />
              </ListItemIcon>
              <ListItemText primary={item.links[0].linkfor} />
            </ListItemButton>
          );
        }

        return (
          <Accordion
            key={index}
            classes={{
              root: classes.accordionRoot
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              classes={{
                root: classes.accordionSummaryRoot
              }}
            >
              <ListItemText primary={item.title} />
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {item.links.map((link) => (
                  <ListItemButton 
                    key={link.path} 
                    onClick={() => {
                      navigate(link.path);
                      onCloseMenu();
                    }}
                    selected={location.pathname === link.path}
                  >
                    <ListItemIcon>
                      <MenuLinkIcon linkfor={link.linkfor} />
                    </ListItemIcon>
                    <ListItemText primary={link.linkfor} />
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </List>
  );
};

export default MenuLinks;
