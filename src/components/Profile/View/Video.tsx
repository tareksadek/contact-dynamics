import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import ReactPlayer from 'react-player';


const Video: React.FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  if (profile && profile.aboutData && profile.aboutData.videoUrl) {
    return (
      <div>
        <div>
          <ReactPlayer url={profile.aboutData.videoUrl} width="100%" />
        </div>
      </div>
    );
  }
  return null
};

export default Video;
