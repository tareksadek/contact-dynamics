import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box, Button } from '@mui/material';
import ProfileImageProcessor from '../../../components/Profile/ProfileImageProcessor';
import CoverImageProcessor from '../../../components/Profile/CoverImageProcessor';
import { profileImageDimensions, coverImageDimensions } from '../../../setup/setup';
import { ImageType } from '../../../types/profile';
import { RootState, AppDispatch } from '../../../store/reducers';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { updateCoverImageData, updateProfileImageData } from '../../../store/actions/profile';
import { layoutStyles } from '../../../theme/layout';

const Images: React.FC = () => {
  const layoutClasses = layoutStyles()
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
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
    const coverImageChanged = !_.isEqual(initialCoverImageData.current, coverImageData);
    const profileImageChanged = !_.isEqual(initialProfileImageData.current, profileImageData);
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
    <Box p={2}>
      <Box pb={2}>
        <Typography variant="h4" align="center">Profile Picture</Typography>
        <ProfileImageProcessor
          isLoading={isLoading}
          data={profileImageData}
          setData={setProfileImageData}
          cropWidth={profileImageDimensions.width}
          cropHeight={profileImageDimensions.height}
        />
      </Box>

      {currentUser && !currentUser.isTeamMember && appSetup && appSetup.coverImageData && !appSetup.coverImageData.url && (
        <Box mt={2} mb={2}>
          <Typography variant="h4" align="center">Cover Photo</Typography>
          <CoverImageProcessor
            isLoading={isLoading}
            data={coverImageData}
            setData={setCoverImageData}
            cropWidth={coverImageDimensions.width}
            cropHeight={coverImageDimensions.height}
          />
        </Box>
      )}

      {formChanged && (
        <Box
          className={layoutClasses.stickyBottomBox}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!formValid || !formChanged}
          >
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Images;