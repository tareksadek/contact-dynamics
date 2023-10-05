import React from 'react';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/reducers';
import { placeHolderProfileImage } from '../../../../setup/setup';

const Header: React.FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  return (
    <div>
      <div style={{ maxWidth: '550px' }}>
        <div>
          {profile && profile.coverImageData.url && (
            <img src={profile.coverImageData.url} alt="Cover" style={{ width: '550px', height: '275px' }} />
          )}
          <Avatar src={profile && profile.profileImageData.url ? profile.profileImageData.url : placeHolderProfileImage} alt="Profile" style={{ width: '120px', height: '120px' }} />
        </div>
        <div>
          <h2>
            {profile && profile.basicInfoData && profile.basicInfoData.firstName ? profile.basicInfoData.firstName : ''}
            {profile && profile.basicInfoData && profile.basicInfoData.lastName ? ` ${profile.basicInfoData.lastName}` : ''}
          </h2>
          <p>
            {profile && profile.basicInfoData && profile.basicInfoData.organization ? profile.basicInfoData.organization : ''}
            &nbsp;-&nbsp; 
            {profile && profile.basicInfoData && profile.basicInfoData.position ? profile.basicInfoData.position : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
