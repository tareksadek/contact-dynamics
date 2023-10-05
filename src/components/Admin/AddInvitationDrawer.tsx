// InvitationDrawer.tsx

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Drawer,
  TextField,
  Button,
  Typography
} from '@mui/material';

interface IFormInput {
  numberOfInvitations: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IFormInput) => void;
}

const InvitationDrawer: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<IFormInput>({ mode: 'onBlur' });

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <div style={{ padding: '20px', width: '300px' }}>
        <Typography variant="h5" gutterBottom>
          Add Invitations
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="numberOfInvitations"
            control={control}
            defaultValue={1}
            rules={{
              required: 'Number of Invitations is required',
              min: { value: 1, message: 'Minimum number is 1' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                variant="outlined"
                margin="normal"
                fullWidth
                label="Number of Invitations"
                error={Boolean(errors.numberOfInvitations)}
                helperText={errors.numberOfInvitations?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
            Add
          </Button>
        </form>
      </div>
    </Drawer>
  );
};

export default InvitationDrawer;
