import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import { Grid, Button, Link } from '@mui/material';
import { SocialIcon } from 'react-social-icons';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { incrementLinkClickCount } from '../../../API/profile';
import { LinkType } from '../../../types/profile';

interface LinksProps {
  linksStyles: {
    socialLinksStyle: string | null;
    customLinksFirst: boolean;
  }
}

const Links: React.FC<LinksProps> = ({ linksStyles }) => {
  const setup = useSelector((state: RootState) => state.setup.setup);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn); 
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const isAccountOwner = isLoggedIn && (authId === user?.id)

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
        <div>
          <Grid container spacing={2}>
            {links.social.map((link, index) => (
              <Grid item xs={2} key={link.id || index}>
                <SocialIcon
                  url={link.url}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link);
                    window.open(link.url, '_blank', 'noopener,noreferrer');
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      {links && links.custom && links.custom.length > 0 && (
        <div>
          <Grid container spacing={2}>
            {links.custom.map((link, index) => (
              <Grid item xs={12} key={link.id || index}>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link)}
                >
                  <Button endIcon={<ArrowForwardIosIcon />}>
                    {link.title}
                  </Button>
                </Link>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </>
  );
};

export default Links;
