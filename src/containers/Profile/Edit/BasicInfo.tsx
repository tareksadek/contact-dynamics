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
import BasicInfoForm from '../../../components/Profile/BasicInfoForm';
import { BasicInfoFormDataTypes } from '../../../types/profile';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { updateBasicInfo } from '../../../store/actions/profile';
import { layoutStyles } from '../../../theme/layout';

const BasicInfo: React.FC = () => {
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

  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  const { control, register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<BasicInfoFormDataTypes>({
    defaultValues: {
      firstName: profile && profile.basicInfoData?.firstName ? profile.basicInfoData?.firstName : '',
      lastName: profile && profile.basicInfoData?.lastName ? profile.basicInfoData?.lastName : '',
      email: profile && profile.basicInfoData?.email? profile.basicInfoData?.email : '',
      phone1: profile && profile.basicInfoData?.phone1 ? profile.basicInfoData?.phone1 : '',
      phone2: profile && profile.basicInfoData?.phone2 ? profile.basicInfoData?.phone2 : '',
      address: profile && profile.basicInfoData?.address ? profile.basicInfoData?.address : '',
      organization: profile && profile.basicInfoData?.organization ? profile.basicInfoData?.organization : '',
      position: profile && profile.basicInfoData?.position ? profile.basicInfoData?.position : '',
    },
    mode: 'onBlur',
  });
  const watchedValues = watch();  

  useEffect(() => {
    if (profile) {
      setValue('firstName', profile.basicInfoData?.firstName || '');
      setValue('lastName', profile.basicInfoData?.lastName || '');
      setValue('email', profile.basicInfoData?.email || '');
      setValue('phone1', profile.basicInfoData?.phone1 || '');
      setValue('phone2', profile.basicInfoData?.phone2 || '');
      setValue('address', profile.basicInfoData?.address || '');
      setValue('organization', profile.basicInfoData?.organization || '');
      setValue('position', profile.basicInfoData?.position || '');
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (profile && profile?.basicInfoData && profile.basicInfoData.address) {
      setCurrentAddress(profile.basicInfoData.address)
    }
    if (profile && profile?.basicInfoData && profile.basicInfoData.location) {
      setLocation(profile.basicInfoData.location)
    }
  }, [profile]);

  const handleBasicInfoSubmit = useCallback((formData: Partial<BasicInfoFormDataTypes>) => {
    if (!authUser?.userId || !user) {
      return;
    }
    formData.location = location
    dispatch(updateBasicInfo(authUser?.userId, user.activeProfileId, formData));
  }, [authUser?.userId, dispatch, user, location]);

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleBasicInfoSubmit)());
  }, [registerSubmit, handleSubmit, handleBasicInfoSubmit]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);  

  useEffect(() => {
    if (profile && profile.basicInfoData) {
      const profileDataWithoutLocation = _.omit(profile.basicInfoData, 'location');      
      const hasChanged = !_.isEqual(profileDataWithoutLocation, watchedValues);
      
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, profile]);

  return (
    <Box>
      <form onSubmit={handleSubmit(handleBasicInfoSubmit)}>
        <BasicInfoForm
          formStatedata={profile ? profile?.basicInfoData : null}
          location={location}
          setLocation={setLocation}
          loadingData={isLoading}
          control={control}
          register={register}
          errors={errors}
          setValue={setValue}
          defaultData={null}
          currentUser={user}
          currentAddress={currentAddress}
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

export default BasicInfo;
