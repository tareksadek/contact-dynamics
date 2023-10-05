import React from 'react';
import { useSelector } from 'react-redux';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { RootState } from '../../../store/reducers';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GoogleMapDisplay from '../GoogleMapDisplay';

const Info: React.FC = () => {
  const setup = useSelector((state: RootState) => state.setup.setup);
  const profile = useSelector((state: RootState) => state.profile.profile);

  let address, location;

  if (setup && setup.basicInfoData && setup.basicInfoData.address) {
    address = setup.basicInfoData.address;
  } else if (profile && profile.basicInfoData && profile.basicInfoData.address) {
    address = profile.basicInfoData.address;
  }

  if (setup && setup.basicInfoData && setup.basicInfoData.location) {
    location = setup.basicInfoData.location;
  } else if (profile && profile.basicInfoData && profile.basicInfoData.location) {
    location = profile.basicInfoData.location;
  }

  return (
    <div>
      <Box>
        <List aria-label="main mailbox folders">
          {profile && profile.basicInfoData && profile.basicInfoData.email && (
            <ListItem>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={(
                  <a href={`mailto:${profile.basicInfoData.email}`}>{profile.basicInfoData.email}</a>
                )}
              />
            </ListItem>
          )}
          {profile && profile.basicInfoData && profile.basicInfoData.phone1 && (
            <ListItem>
              <ListItemIcon>
                <PhoneIphoneIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={(
                  <a href={`tel:${profile.basicInfoData.phone1}`}>{profile.basicInfoData.phone1}</a>
                )}
              />
            </ListItem>
          )}
          {profile && profile.basicInfoData && profile.basicInfoData.phone2 && (
            <ListItem>
              <ListItemIcon>
                <PhoneIphoneIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={(
                  <a href={`tel:${profile.basicInfoData.phone2}`}>{profile.basicInfoData.phone2}</a>
                )}
              />
            </ListItem>
          )}
          {address && location && (
            <>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={(
                    <a href={`geo:${location && location.lat ? location.lat : 0},${location && location.lng ? location.lng : 0}?q=${address}`}>
                      {address}
                    </a>
                  )}
                />
              </ListItem>
              {location && location.lat && location.lng && (
                <ListItem>
                  <GoogleMapDisplay lat={location.lat} lng={location.lng} />
                </ListItem>
              )}
            </>
          )}
          {address && !location && (
            <>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={(
                    <p>
                      {address}
                    </p>
                  )}
                />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </div>
  );
};

export default Info;
