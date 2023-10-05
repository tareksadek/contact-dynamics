import React from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { UserType } from '../../../types/user';

interface StepZeroProps {
  formStatedata: string | null;
  onSubmit: (formStatedata: string) => void;
  currentUser: UserType | null;
  loadingUser: boolean;
}

const StepZero: React.FC<StepZeroProps> = ({ formStatedata, onSubmit, currentUser, loadingUser }) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      title: formStatedata || '',
    },
    mode: 'onBlur',
  });
  

  return (
    <form
      onSubmit={handleSubmit(formData => {
        onSubmit(formData.title)
      })}
    >
      <Typography variant="h5" gutterBottom>Profile title</Typography>

      <div>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Profile title is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Profile Title*"
              disabled={loadingUser && !formStatedata}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
          )}
        />
        <Typography color="error">
          {errors.title && errors.title.message}
        </Typography>
      </div>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: '16px' }}
        disabled={!isValid}
      >
        Next
      </Button>
    </form>
  );
}

export default StepZero;
