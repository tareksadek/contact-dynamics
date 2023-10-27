import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import _ from 'lodash';
import { Typography, RadioGroup, TextField, Radio, FormControlLabel, Box, Drawer, IconButton, Button, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { RootState, AppDispatch } from '../../store/reducers';
import { ContactFormType } from '../../types/profile';
import { useRegisterSubmit, SubmitContext } from '../../contexts/SubmitContext';
import { updateContactFormData } from '../../store/actions/profile';
import { openModal, closeMenu } from '../../store/actions/modal';
import { layoutStyles } from '../../theme/layout';
import { contactFormStyles } from './styles';
import { formOptions } from '../../setup/setup';
import SaveButton from '../../Layout/SaveButton';

const ContactForm: React.FC = () => {
  const layoutClasses = layoutStyles()
  const classes = contactFormStyles()
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isSelectedFormModalOpen = openModalName === 'selectForm';
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
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
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  console.log(selectedForm);
  

  useEffect(() => {
    if (profile) {
      setValue('formProvider', profile.contactFormData?.formProvider || '');
      setValue('embedCode', profile.contactFormData?.embedCode || '');
      if (profile.contactFormData?.formProvider) {
        setSelectedForm(profile.contactFormData?.formProvider)
      }
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

    if (formData.formProvider && formData.formProvider !== 'default') {
      formData.formProvider = selectedForm
    }

    dispatch(updateContactFormData(authUser?.userId, user.activeProfileId, formData));
    setTimeout(() => {
      setFormChanged(false)
      dispatch(closeMenu())
    }, 500)
  }, [authUser?.userId, dispatch, user, selectedForm, setFormChanged]);
  
  useEffect(() => {
    registerSubmit(() => handleSubmit(handleContactFormSubmit)());
  }, [registerSubmit, handleSubmit, handleContactFormSubmit]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  useEffect(() => {
    if (profile && profile.contactFormData) {
      const hasChanged = !_.isEqual(profile.contactFormData, watchedValues);
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, profile]);

  const handleRadioChange = useCallback((value: string) => {
    const selectedOption = formOptions.find(option => option.value === value);
    console.log(selectedOption);
    
    if (selectedOption) {
      setDescription(selectedOption.description);
      setSelectedForm(selectedOption.value)
    }
    if (value !== 'default') {
      dispatch(openModal('selectForm'));
    } else {
      // setSelectedForm('default')
      handleContactFormSubmit({
        embedCode: null,
        formProvider: 'default'
      })
    }
  }, [dispatch, handleContactFormSubmit]);
  

  const closeFormDrawer = () => {
    if (profile && profile.contactFormData?.formProvider) {
      setSelectedForm(profile.contactFormData?.formProvider)
    }
    dispatch(closeMenu())
  }
  

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit(handleContactFormSubmit)}>
        <Box mb={2}>
          <Typography variant="body1" align="center">
            Select the form that card visitors will use to connect with you
          </Typography>
        </Box>
        <Box className={classes.formSelectContainer}>
          <Controller
            name="formProvider"
            control={control}
            rules={{ required: 'Form provider is required' }}
            render={({ field }) => (
              <RadioGroup {...field} row>
                {formOptions.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={
                      <Radio
                        icon={undefined} 
                        checkedIcon={<CheckCircleIcon />}
                        // checked={option.value.toLowerCase() === selectedForm}
                      />
                    }
                    label={
                      <Box className={classes.formOptionContainer} onClick={() => handleRadioChange(option.value)}>
                        <Box className={classes.forOptionImageContainer}>
                          <img src={`/assets/images/${option.img}`} alt={option.display} width={50} />
                        </Box>
                        <Typography variant="body1">{option.display}</Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            )}
          />
          <Typography color="error">
            {errors.formProvider && errors.formProvider.message}
          </Typography>
        </Box>

        <Drawer
          anchor="bottom"
          open={isSelectedFormModalOpen}
          onClose={() => closeFormDrawer()}
          PaperProps={{
            className: layoutClasses.radiusBottomDrawer
          }}
        >
          <Box p={2}>
            <Box maxWidth={565} display="flex" alignItems="center" justifyContent="center" p={1} style={{ margin: '0 auto' }}>
              <Alert severity="warning">
                Information gathered with a custom form will not show on the contacts section of this app
              </Alert>
            </Box>
            <Box mt={1}>
              <Typography variant="body1" align="left">{description}</Typography>
            </Box>
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <SaveButton
                type="submit"
                onClick={handleSubmit(handleContactFormSubmit)}
                text = "Save"
                disabled={!formValid || !formChanged}
              />
            </Box>
          </Box>
          <IconButton
            aria-label="delete"
            color="primary"
            className={layoutClasses.drawerCloseButton}
            onClick={() => closeFormDrawer()}
          >
            <CloseIcon />
          </IconButton>
        </Drawer>
      </form>
    </Box>
  );
}

export default ContactForm;