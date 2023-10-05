import React from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAPS_KEY } from '../../setup/setup';

type MarkerProps = {
  lat: number;
  lng: number;
};

const Marker: React.FC<MarkerProps> = () => <PlaceIcon color="primary" style={{ fontSize: 30 }} />;

type GoogleMapDisplayProps = {
  lat: number;
  lng: number;
};

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ lat, lng }) => {
  const defaultProps = {
    center: {
      lat: lat,
      lng: lng
    },
    zoom: 11
  };

  return (
    <div style={{ height: '200px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <Marker
          lat={lat}
          lng={lng}
        />
      </GoogleMapReact>
    </div>
  );
}

export default GoogleMapDisplay;
