import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import ReactPlayer from 'react-player';


const Video: React.FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  if (profile && profile.aboutData && profile.aboutData.videoUrl) {
    return (
      <Box width="100%">
        <ReactPlayer url={profile.aboutData.videoUrl} width="100%" />
      </Box>
    );
  }
  return null
};

export default Video;
