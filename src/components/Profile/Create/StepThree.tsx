import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import ProfileImageProcessor from '../ProfileImageProcessor';
import CoverImageProcessor from '../CoverImageProcessor';
import { profileImageDimensions, coverImageDimensions } from '../../../setup/setup';
import { UserType } from '../../../types/user';
import { ImageType } from '../../../types/profile';
import { RootState } from '../../../store/reducers';

interface StepThreeProps {
  onNext: () => void;
  onPrev: () => void;
  coverImageData: ImageType | null;
  setCoverImageData: React.Dispatch<React.SetStateAction<ImageType>>;
  initialCoverImage?: string | null;
  profileImageData: ImageType | null;
  setProfileImageData: React.Dispatch<React.SetStateAction<ImageType>>;
  initialProfileImage?: string | null;
  currentUser: UserType | null;
  isLastStep: boolean;
}

const StepThree: React.FC<StepThreeProps> = ({
  onNext,
  onPrev,
  coverImageData,
  setCoverImageData,
  initialCoverImage,
  profileImageData,
  setProfileImageData,
  initialProfileImage,
  currentUser,
  isLastStep,
}) => {
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  
  useEffect(() => {
    if (initialCoverImage && coverImageData && !coverImageData.url) {
      setCoverImageData({
        url: initialCoverImage,
        blob: null,
        base64: null
      });
    }
    if (initialProfileImage && profileImageData && !profileImageData.url) {      
      setProfileImageData({
        url: initialProfileImage,
        blob: null,
        base64: null
      });
    }
  }, [
    coverImageData,
    setCoverImageData,
    initialCoverImage,
    profileImageData,
    setProfileImageData,
    initialProfileImage,
  ]);

  return (
    <div>
      {currentUser && !currentUser.isTeamMember && appSetup && appSetup.coverImageData && !appSetup.coverImageData.url && (
        <div>
          <Typography variant="h5" gutterBottom>Cover Image</Typography>
          <CoverImageProcessor
            data={coverImageData}
            setData={setCoverImageData}
            cropWidth={coverImageDimensions.width}
            cropHeight={coverImageDimensions.height}
          />
        </div>
      )}

      <div>
        <Typography variant="h5" gutterBottom>Profile Image</Typography>
        <ProfileImageProcessor
          data={profileImageData}
          setData={setProfileImageData}
          cropWidth={profileImageDimensions.width}
          cropHeight={profileImageDimensions.height}
        />
      </div>

      <div>
        <Button onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>{isLastStep ? 'Finish' : 'Next'}</Button>
      </div>
    </div>
  );
}

export default React.memo(StepThree);
