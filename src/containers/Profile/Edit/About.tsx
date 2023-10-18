import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import _ from 'lodash';
import { Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, AppDispatch } from '../../../store/reducers';
import AboutForm from '../../../components/Profile/AboutForm';
import { AboutFormDataTypes } from '../../../types/profile';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { updateAboutInfoData } from '../../../store/actions/profile';
import { layoutStyles } from '../../../theme/layout';

const About: React.FC = () => {
  const layoutClasses = layoutStyles()
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const { control, register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<AboutFormDataTypes>({
    defaultValues: {
      about: profile && profile.aboutData?.about ? profile.aboutData?.about : '',
      videoUrl: profile && profile.aboutData?.videoUrl ? profile.aboutData?.videoUrl : '',
    },
    mode: 'onBlur',
  });
  const watchedValues = watch();

  console.log(profile);
  

  useEffect(() => {
    if (profile) {
      setValue('about', profile.aboutData?.about || '');
      setValue('videoUrl', profile.aboutData?.videoUrl || '');
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (profile && profile?.aboutData && profile.aboutData.videoUrl) {
      setCurrentVideo(profile.aboutData.videoUrl)
    }
  }, [profile]);

  const handleAboutSubmit = useCallback((formData: Partial<AboutFormDataTypes>) => {
    if (!authUser?.userId || !user) {
      return;
    }
    dispatch(updateAboutInfoData(authUser?.userId, user.activeProfileId, formData));
    console.log(formData);
  }, [authUser?.userId, dispatch, user]);

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleAboutSubmit)());
  }, [registerSubmit, handleSubmit, handleAboutSubmit]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  useEffect(() => {
    if (profile && profile.aboutData) {
      const hasChanged = !_.isEqual(profile.aboutData, watchedValues);
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, profile]);

  return (
    <Box>
      <form onSubmit={handleSubmit(handleAboutSubmit)}>
        <AboutForm
          formStatedata={profile ? profile?.aboutData : null}
          loadingData={isLoading}
          control={control}
          register={register}
          errors={errors}
          setValue={setValue}
          defaultData={null}
          currentUser={user}
          currentVideo={currentVideo}
        />
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
      </form> 
    </Box>
  );
}

export default About;