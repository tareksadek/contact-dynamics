import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/reducers';
import { placeHolderProfileImage } from '../../../../setup/setup';
import { businessHeaderStyles } from '../styles';
import SocialLinks from '../SocialLinks';

const Header: React.FC = () => {
  const classes = businessHeaderStyles()
  const setup = useSelector((state: RootState) => state.setup.setup);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const themeColorCode = profile?.themeSettings.selectedColor.code

  let organization;

  if (setup && setup.basicInfoData && setup.basicInfoData.organization) {
    organization = setup.basicInfoData.organization;
  } else if (profile && profile.basicInfoData && profile.basicInfoData.organization) {
    organization = profile.basicInfoData.organization;
  }

  return (
    <Box width="100%" maxWidth={550} className={classes.headerContainer}>
      <Box className={classes.imagesContainer} mb={1} width="100%">
        <Box
          className={classes.coverImageContainer}
          maxWidth={550}
          width="100%"
          minHeight={275}
          style={{
            backgroundColor: themeColorCode,
          }}
        >
          <Box className={classes.dataContainer} pt={6} pl={2} maxWidth={250}>
            <Box>
              <Typography variant="h3" align="left">
                {profile && profile.basicInfoData && profile.basicInfoData.firstName ? profile.basicInfoData.firstName : ''}
                {profile && profile.basicInfoData && profile.basicInfoData.lastName ? ` ${profile.basicInfoData.lastName}` : ''}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" align="left">
                {organization || ''}
                {profile && profile.basicInfoData && profile.basicInfoData.position && organization ? ' - ' : ''}
                {profile && profile.basicInfoData && profile.basicInfoData.position ? profile.basicInfoData.position : ''}
              </Typography>
            </Box>
            <SocialLinks
              linksStyles={{
                socialLinksStyle: 'rounded',
                align: 'flex-start',
                noBackground: true,
                size: 35
              }}
            />
          </Box>
        </Box>
        <Box
          className={classes.profileImageContainer}
          width={131}
          height={131}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            src={profile && profile.profileImageData.url ? profile.profileImageData.url : placeHolderProfileImage}
            alt="Profile"
            sx={{ width: 125, height: 125 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
