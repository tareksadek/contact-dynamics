import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import { Typography, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { RootState, AppDispatch } from '../../store/reducers';
import { ContactFormType } from '../../types/profile';
import { useRegisterSubmit, SubmitContext } from '../../contexts/SubmitContext';
import { updateContactFormData } from '../../store/actions/profile';

const ContactForm: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid } = context;
  const dispatch = useDispatch<AppDispatch>();

  const { control, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<ContactFormType>({
    defaultValues: {
      formProvider: profile && profile.contactFormData?.formProvider ? profile.contactFormData?.formProvider : '',
      embedCode: profile && profile.contactFormData?.embedCode ? profile.contactFormData?.embedCode : '',
    },
    mode: 'onBlur',
  });
  const watchedValues = watch();

  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    switch (watchedValues.formProvider) {
      case 'google':
        setDescription('To get the embed code from Google Form, go to...');
        break;
      case 'microsoft':
        setDescription('To get the embed code from Microsoft Form, go to...');
        break;
      case 'typeform':
        setDescription('To get the embed code from Typeform Form, go to...');
        break;
      case 'jotform':
        setDescription('To get the embed code from Jotform Form, go to...');
        break;
      default:
        setDescription('');
    }
  }, [watchedValues.formProvider]);

  useEffect(() => {
    if (profile) {
      setValue('formProvider', profile.contactFormData?.formProvider || '');
      setValue('embedCode', profile.contactFormData?.embedCode || '');
    }
  }, [profile, setValue]);

  const handleContactFormSubmit = useCallback((formData: Partial<ContactFormType>) => {
    if (!authUser?.userId || !user) {
      return;
    }
    // Modify the embedCode to change static width and height to "100%"
    if (formData.embedCode) {
      formData.embedCode = formData.embedCode.replace(/width="\d+(\.\d+)?(px)?"/i, 'width="100%"');
      formData.embedCode = formData.embedCode.replace(/height="\d+(\.\d+)?(px)?"/i, 'height="100%"');
    }
    dispatch(updateContactFormData(authUser?.userId, user.activeProfileId, formData));
  }, [authUser?.userId, dispatch, user]);

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleContactFormSubmit)());
  }, [registerSubmit, handleSubmit, handleContactFormSubmit]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  useEffect(() => {
    if (profile && profile.contactFormData) {
      const hasChanged = JSON.stringify(profile.contactFormData) !== JSON.stringify(watchedValues);
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, profile]);

  return (
    <div>
      <form onSubmit={handleSubmit(handleContactFormSubmit)}>
        <Typography variant="h5" gutterBottom>Contact form</Typography>

        <Controller
          name="formProvider"
          control={control}
          rules={{ required: 'Form provider is required' }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>Form Provider</InputLabel>
              <Select
                {...field}
                onChange={(e) => {
                  field.onChange(e);

                  if (e.target.value === 'default') {
                    setValue('embedCode', '');
                  }
                }}
              >
                {[
                  { value: 'default', display: 'Default' },
                  { value: 'google', display: 'Google Form' },
                  { value: 'microsoft', display: 'Microsoft Form' },
                  { value: 'typeform', display: 'Type Form' },
                  { value: 'jotform', display: 'Jot Form' },
                ].map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Typography color="error">
          {errors.formProvider && errors.formProvider.message}
        </Typography>

        <Typography variant="body1" gutterBottom>{description}</Typography>
        {watchedValues.formProvider !== 'default' && (
          <>
            <Controller
              name="embedCode"
              control={control}
              rules={{ required: 'Embed code is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Embed Code"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="normal"
                  error={Boolean(errors.embedCode)}
                  helperText={errors.embedCode?.message}
                />
              )}
            />
            <Typography color="error">
              {errors.embedCode && errors.embedCode.message}
            </Typography>
          </>
        )}
      </form>
    </div>
  );
}

export default ContactForm;