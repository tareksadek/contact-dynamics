import React from 'react';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/reducers';
import { placeHolderProfileImage } from '../../../../setup/setup';

const Header: React.FC = () => {
  const setup = useSelector((state: RootState) => state.setup.setup);
  const profile = useSelector((state: RootState) => state.profile.profile);

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
    <div>
      <div style={{ maxWidth: '550px' }}>
        <div>
          {coverImage && (
            <img src={coverImage} alt="Cover" style={{ width: '550px', height: '275px' }} />
          )}
          <Avatar src={profile && profile.profileImageData.url ? profile.profileImageData.url : placeHolderProfileImage} alt="Profile" style={{ width: '120px', height: '120px' }} />
        </div>
        <div>
          <h2>
            {profile && profile.basicInfoData && profile.basicInfoData.firstName ? profile.basicInfoData.firstName : ''}
            {profile && profile.basicInfoData && profile.basicInfoData.lastName ? ` ${profile.basicInfoData.lastName}` : ''}
          </h2>
          <p>
            {organization || ''}
            {profile && profile.basicInfoData && profile.basicInfoData.position && organization ? ' - ' : ''}
            {profile && profile.basicInfoData && profile.basicInfoData.position ? profile.basicInfoData.position : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
