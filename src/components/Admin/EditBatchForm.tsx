import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, TextField, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { BatchData } from '../../types/userInvitation';

interface BatchFormProps {
  batch?: BatchData | null;
  onSubmit: (data: any) => Promise<void>;
  loadingData: boolean;
}

const EditBatchForm: React.FC<BatchFormProps> = ({
  batch,
  onSubmit,
  loadingData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
    },
    mode: 'onBlur',
  });
  const watchedValues = watch();

  const [formChanged, setFormChanged] = useState(false)

  useEffect(() => {
    if (batch) {
      setValue('title', batch?.title || '');
    }
  }, [batch, setValue]);

  useEffect(() => {
    if (batch) {
      const { title } = batch;
      const filteredBatch = { title };
      const hasChanged = !_.isEqual(filteredBatch, watchedValues);
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, batch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* FirstName Input */}
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title name is required', minLength: { value: 2, message: 'Minimum length is 2 characters' } }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Title*"
            disabled={loadingData}
            error={Boolean(errors.title)}
            helperText={errors.title?.message as string}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isValid || !formChanged}
        fullWidth
      >
        Update
      </Button>
    </form>
  );
};

export default EditBatchForm;
