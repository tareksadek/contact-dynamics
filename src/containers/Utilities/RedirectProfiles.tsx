import React, {
  useEffect,
  useCallback,
  useContext,
} from 'react';
import _ from 'lodash';
import { Typography, TextField, Switch, FormControlLabel, Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { RootState, AppDispatch } from '../../store/reducers';
import { useRegisterSubmit, SubmitContext } from '../../contexts/SubmitContext';
import validator from 'validator';
import { RedirectType } from '../../types/user';
import { redirectUser } from '../../store/actions/user';
import { layoutStyles } from '../../theme/layout';
import SaveButton from '../../Layout/SaveButton';

const RedirectProfiles: React.FC = () => {
  const layoutClasses = layoutStyles()
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;

  const { control, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<RedirectType>({
    defaultValues: {
      active: user && user.redirect ? user.redirect.active : false,
      url: user && user.redirect ? user.redirect.url : ''
    },
    mode: 'onBlur',
  });
  const watchedValues = watch();
  const { active } = watchedValues;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      setValue('active', user && user.redirect ? user.redirect.active : false);
      setValue('url', user && user.redirect ? user.redirect.url : '')
    }
  }, [user, setValue]);

  const handleRedirectSubmit = useCallback(async (formData: RedirectType) => {
    if (!authUser?.userId) {
      return;
    }
    if (user) {
      dispatch(redirectUser(user.id, formData));
    }
     
  }, [authUser?.userId, dispatch, user]);

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleRedirectSubmit)());
  }, [registerSubmit, handleSubmit, handleRedirectSubmit]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  useEffect(() => {
    if (user && user.redirect) {
      const hasChanged = !_.isEqual(user.redirect, watchedValues);
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, user]);

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit(handleRedirectSubmit)}>
        <Typography variant="body1">If active, card visitors will be redirected to the URL.</Typography>
        
        <Box pb={2} pt={2}>
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                label="Active"
              />
            )}
          />
        </Box>
        
        <Box width="100%">
          <Controller
            name="url"
            control={control}
            rules={{
              validate: value => {
                  if (active) {
                      if (!value) return "URL is required when active";
                      return validator.isURL(value, { require_protocol: true }) || "Please enter a valid URL";
                  }
                  return true;
              }
            }}
            render={({ field }) => (
              <TextField
                label="URL"
                {...field}
                disabled={!watchedValues.active}  // Disable the TextField when 'active' is false
                error={Boolean(errors.url)}
                helperText={errors.url?.message}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!inputValue.startsWith("https://") && !inputValue.startsWith("http://")) {
                    e.target.value = "https://" + inputValue;
                  }
                  field.onChange(e);
                }}
                fullWidth
              />
            )}
          />
        </Box>
        
        <Box
          className={layoutClasses.stickyBottomBox}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!formValid || !formChanged}
          >
            Save
          </Button> */}
          <SaveButton
            type="submit"
            text = "Save"
            disabled={!formValid || !formChanged}
          />
        </Box>
      </form>
    </Box>
  );
}

export default RedirectProfiles;
