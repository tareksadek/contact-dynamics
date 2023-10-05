import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import ProfileImageProcessor from '../../../components/Profile/ProfileImageProcessor';
import CoverImageProcessor from '../../../components/Profile/CoverImageProcessor';
import { profileImageDimensions, coverImageDimensions } from '../../../setup/setup';
import { ImageType } from '../../../types/profile';
import { RootState, AppDispatch } from '../../../store/reducers';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { updateCoverImageData, updateProfileImageData } from '../../../store/actions/profile';

const Images: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [coverImageData, setCoverImageData] = useState<ImageType>({
    url: null,
    blob: null,
    base64: null
  });
  const [profileImageData, setProfileImageData] = useState<ImageType>({
    url: null,
    blob: null,
    base64: null
  });

  const initialCoverImageData = useRef<ImageType>(coverImageData);
  const initialProfileImageData = useRef<ImageType>(profileImageData);

  console.log(coverImageData);
  console.log(profileImageData);

  const checkIfImagesChanged = useCallback(() => {
    const coverImageChanged = JSON.stringify(initialCoverImageData.current) !== JSON.stringify(coverImageData);
    const profileImageChanged = JSON.stringify(initialProfileImageData.current) !== JSON.stringify(profileImageData);
    return { coverImageChanged, profileImageChanged }
  }, [coverImageData, profileImageData]);

  const handleImagesSubmit = useCallback(() => {
    if (!authUser?.userId || !user) {
      return;
    }
    const imagesChanged = checkIfImagesChanged();

    if (imagesChanged.coverImageChanged && coverImageData.url) {
      const updatedCoverImage = {
        url: coverImageData.url,
        base64: coverImageData.base64 || '', 
        blob: coverImageData.blob || new Blob(),
      };
      dispatch(updateCoverImageData(authUser?.userId, user.activeProfileId, updatedCoverImage))
    }

    if (imagesChanged.profileImageChanged && profileImageData.url) {
      const updatedProfileImage = {
        url: profileImageData.url,
        base64: profileImageData.base64 || '',
        blob: profileImageData.blob || new Blob(),
      };
      dispatch(updateProfileImageData(authUser?.userId, user.activeProfileId, updatedProfileImage))
    }

    console.log(coverImageData);
    console.log(profileImageData);
    
  }, [authUser?.userId, user, coverImageData, profileImageData, checkIfImagesChanged, dispatch]);

  useEffect(() => {
    if (profile && profile.coverImageData) {
      setCoverImageData(profile.coverImageData)
      initialCoverImageData.current = profile.coverImageData;
    }
    if (profile && profile.profileImageData) {
      setProfileImageData(profile.profileImageData)
      initialProfileImageData.current = profile.profileImageData;
    }
  }, [profile]);

  useEffect(() => {
    registerSubmit(handleImagesSubmit);
  }, [registerSubmit, handleImagesSubmit]);

  useEffect(() => {
    const imagesChanged = checkIfImagesChanged();
    console.log(imagesChanged);
    setFormValid(true)
    setFormChanged(imagesChanged.coverImageChanged || imagesChanged.profileImageChanged);
  }, [checkIfImagesChanged, setFormChanged, setFormValid]);

  return (
    <div>
      {currentUser && !currentUser.isTeamMember && appSetup && appSetup.coverImageData && !appSetup.coverImageData.url && (
        <div>
          <Typography variant="h5" gutterBottom>Cover Image</Typography>
          <CoverImageProcessor
            isLoading={isLoading}
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
          isLoading={isLoading}
          data={profileImageData}
          setData={setProfileImageData}
          cropWidth={profileImageDimensions.width}
          cropHeight={profileImageDimensions.height}
        />
      </div>
    </div>
  );
}

export default Images;