import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import { Grid, Button, Link, Box } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { incrementLinkClickCount } from '../../../API/profile';
import { LinkType } from '../../../types/profile';

const CustomLinks = () => {
  const setup = useSelector((state: RootState) => state.setup.setup);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn); 
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const isAccountOwner = isLoggedIn && (authId === user?.id)
  const themeColorName = profile?.themeSettings.selectedColor.name
  const themeColorCode = profile?.themeSettings.selectedColor.code
  const borderColor = themeColorName !== 'grey' && themeColorCode ? themeColorCode : null;

  let links;

  if (setup && setup.links) {
    links = setup.links;
  } else if (profile && profile.links) {
    links = profile.links;
  }

  const handleLinkClick = async (link: LinkType) => {
    if((!isLoggedIn || !isAccountOwner) && user && user.id && profile && profile.id && link && link.id) {
      await incrementLinkClickCount(user.id, profile.id, link.id);
    }
  }

  return (
    <>
      {links && links.custom && links.custom.length > 0 && (
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            flexDirection="column"
            gap={2}
            pl={1}
            pr={1}
          >
            {links.custom.map((link, index) => (
              <Box
                key={link.id || index}
                width="100%"
              >
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link)}
                  width="100%"
                >
                  <Button
                    endIcon={<ArrowForwardIosIcon />}
                    variant='outlined'
                    fullWidth
                    style={{
                      justifyContent: 'space-between',
                      ...(borderColor ? { borderColor: borderColor } : {}),
                      ...(borderColor ? { color: borderColor } : {})
                    }}
                  >
                    {link.title}
                  </Button>
                </Link>
              </Box>
            ))}
          </Box>
      )}
    </>
  );
};

export default CustomLinks;
