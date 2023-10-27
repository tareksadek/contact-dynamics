import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import { Box } from '@mui/material';
import { SocialIcon } from 'react-social-icons';
import { incrementLinkClickCount } from '../../../API/profile';
import { LinkType } from '../../../types/profile';

interface LinksProps {
  linksStyles: {
    socialLinksStyle: string | null;
    align?: string | null;
    noBackground?: boolean;
    size?: number | null;
  }
}

const SocialLinks: React.FC<LinksProps> = ({ linksStyles }) => {
  const setup = useSelector((state: RootState) => state.setup.setup);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn); 
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const isAccountOwner = isLoggedIn && (authId === user?.id)
  const themeColorName = profile?.themeSettings.selectedColor.name
  const themeColorCode = profile?.themeSettings.selectedColor.code
  const backgroundColor = themeColorName !== 'grey' && themeColorCode ? themeColorCode : null;
  const socialLinksToSelectedColor = profile?.themeSettings.socialLinksToSelectedColor

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
      {links && links.social && links.social.length > 0 && (
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={linksStyles.align || (links.social.length >= 8 ? "flex-start" : "center")}
            flexWrap="wrap"
            gap={linksStyles.size && linksStyles.size < 50 ? 1 : 2}
            pl={2}
          >
            {links.social.map((link, index) => (
              <SocialIcon
                key={link.id || index}
                url={link.url}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link);
                  window.open(link.url, '_blank', 'noopener,noreferrer');
                }}
                style={{
                  width: linksStyles.size || 50,
                  height: linksStyles.size || 50
                }}
                {...(linksStyles.noBackground ? { fgColor: '#ffffff' } : {})}
                {...(linksStyles.noBackground ? { bgColor: 'transparent' } : (socialLinksToSelectedColor && backgroundColor ? { bgColor: backgroundColor } : {}))}
              />
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default SocialLinks;
