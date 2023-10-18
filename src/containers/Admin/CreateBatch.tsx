import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Timestamp } from '@firebase/firestore';
import { Box, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TextField, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
// import ThemeCreator from '../../components/Profile/ThemeCreator';
import { ThemeSettingsType } from '../../types/profile';
import { BatchData } from '../../types/userInvitation';
import {
  appDefaultTheme,
  appDefaultColor,
  appDefaultLayout,
  appDefaultSocialLinksToSelectedColor,
} from '../../setup/setup';
import { RootState, AppDispatch } from '../../store/reducers';
import { createBatch } from '../../store/actions/batch';
import { layoutStyles } from '../../theme/layout';

const CreateBatch: React.FC = () => {
  const layoutClasses = layoutStyles()
  const navigate = useNavigate();
  const setup = useSelector((state: RootState) => state.setup.setup);
  const dispatch = useDispatch<AppDispatch>();

  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
  });


  const [themeSettings, setThemeSettings] = useState<ThemeSettingsType>({
    selectedColor: appDefaultColor,
    theme: appDefaultTheme,
    layout: appDefaultLayout,
    socialLinksToSelectedColor: appDefaultSocialLinksToSelectedColor
  });
  const initialThemeData = useRef<ThemeSettingsType>(themeSettings);

  const checkIfThemeChanged = useCallback(() => {
    const themeChanged = JSON.stringify(initialThemeData.current) !== JSON.stringify(themeSettings);
    return themeChanged
  }, [themeSettings]);

  const handleSubmitFunction = (formData: any) => {
    const batchData: BatchData = {
      themeSettings,
      appLabel: null,
      createdOn: Timestamp.now().toDate(),
      status: null,
      stripeProductId: null,
      withSubscription: false,
      title: formData.title,
      isTeams: formData.isTeams,
    };    
    
    dispatch(createBatch(batchData, formData.numberOfInvitations));
    navigate('/batches')
  };  

  useEffect(() => {
    if (setup && setup.themeSettings) {
      setThemeSettings(setup.themeSettings)
      initialThemeData.current = setup.themeSettings;
    }
  }, [setup]);


  useEffect(() => {
    const themeChanged = checkIfThemeChanged();
    console.log(themeChanged);
    
  }, [checkIfThemeChanged]);

  return (
    <Box>
      <form onSubmit={handleSubmit(handleSubmitFunction)}>
        <TextField
          {...register("title", { required: "Title is required" })}
          label="Title*"
          variant="outlined"
          fullWidth
          margin="normal"
          error={Boolean(errors.title)}
          helperText={String(errors.title?.message || '')}
        />

        <TextField
          {...register("numberOfInvitations", { required: "This field is required", valueAsNumber: true })}
          label="Number of Invitations*"
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          error={Boolean(errors.numberOfInvitations)}
          helperText={String(errors.numberOfInvitations?.message || '')}
        />

        {setup && setup.withTeams && (
          <Controller
            name="isTeams"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Box mt={2}>
                <Typography variant="body1" align="left">Batch type</Typography>
                <RadioGroup row {...field}>
                  <FormControlLabel value={false} control={<Radio />} label="Default" style={{ marginRight: 16 }} />
                  <FormControlLabel value={true} control={<Radio />} label="Teams" />
                </RadioGroup>
              </Box>
            )}
          />
        )}

        {/* <ThemeCreator
          data={themeSettings}
          setData={setThemeSettings}
          favoriteColors={null}
          setFavoriteColors={null}
        /> */}
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
            disabled={!isValid}
          >
            Create batch
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateBatch;
