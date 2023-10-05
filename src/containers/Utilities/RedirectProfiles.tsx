import React, {
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { Typography, TextField, Switch, FormControlLabel } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { RootState, AppDispatch } from '../../store/reducers';
import { useRegisterSubmit, SubmitContext } from '../../contexts/SubmitContext';
import validator from 'validator';
import { RedirectType } from '../../types/user';
import { redirectUser } from '../../store/actions/user';

const RedirectProfiles: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid } = context;

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
      const hasChanged = JSON.stringify(user.redirect) !== JSON.stringify(watchedValues);
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, user]);

  return (
    <div>
      <form onSubmit={handleSubmit(handleRedirectSubmit)}>
        <Typography variant="h5" gutterBottom>Redirect your profiles</Typography>
        
        {/* Switch to control 'active' state */}
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

        {/* URL TextField */}
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
            />
          )}
        />
        
        {/* Possibly add a submit button */}
      </form>
    </div>
  );
}

export default RedirectProfiles;
