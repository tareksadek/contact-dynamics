import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Drawer,
  TextField,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { layoutStyles } from '../../theme/layout';
import CloseIcon from '@mui/icons-material/Close';

interface IFormInput {
  numberOfInvitations: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IFormInput) => void;
}

const InvitationDrawer: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const layoutClasses = layoutStyles()
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<IFormInput>({ mode: 'onBlur' });

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: layoutClasses.radiusBottomDrawer
      }}
    >
      <Box p={2}>
        <Typography variant="h4" align="center">Add Invitations</Typography>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid}
            fullWidth
          >
            Confirm
          </Button>
        </form>
      </Box>
      <IconButton
        aria-label="delete"
        color="primary"
        className={layoutClasses.drawerCloseButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Drawer>
  );
};

export default InvitationDrawer;
