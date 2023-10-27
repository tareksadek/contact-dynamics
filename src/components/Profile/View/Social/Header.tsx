import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/reducers';
import { placeHolderProfileImage } from '../../../../setup/setup';
import { socialHeaderStyles } from '../styles';

const Header: React.FC = () => {
  const classes = socialHeaderStyles()
  const setup = useSelector((state: RootState) => state.setup.setup);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const themeColorCode = profile?.themeSettings.selectedColor.code

  let coverImage, organization;

  if (setup && setup.coverImageData && setup.coverImageData.url) {
    coverImage = setup.coverImageData.url;
  } else if (profile && profile.coverImageData && profile.coverImageData.url) {
    coverImage = profile.coverImageData.url;
  }

  if (setup && setup.basicInfoData && setup.basicInfoData.organization) {
    organization = setup.basicInfoData.organization;
  } else if (profile && profile.basicInfoData && profile.basicInfoData.organization) {
    organization = profile.basicInfoData.organization;
  }

  return (
    <Box width="100%" maxWidth={550} className={classes.headerContainer}>
      <Box className={classes.imagesContainer}>
        <Box
          className={classes.coverImageContainer}
          maxWidth={550}
          width="100%"
          style={{
            backgroundColor: coverImage ? 'transparent' : themeColorCode,
          }}
        >
            <img src={profile && profile.profileImageData.url ? profile.profileImageData.url : placeHolderProfileImage} alt="Profile" />
          <Box
            className={classes.cardContainer}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Box className={classes.dataContainer} mt={1}>
              <Box>
                <Typography variant="h3" align="center">
                  {profile && profile.basicInfoData && profile.basicInfoData.firstName ? profile.basicInfoData.firstName : ''}
                  {profile && profile.basicInfoData && profile.basicInfoData.lastName ? ` ${profile.basicInfoData.lastName}` : ''}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" align="center">
                  {organization || ''}
                  {profile && profile.basicInfoData && profile.basicInfoData.position && organization ? ' - ' : ''}
                  {profile && profile.basicInfoData && profile.basicInfoData.position ? profile.basicInfoData.position : ''}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
      </Box>
    </Box>
  );
};

export default Header;
