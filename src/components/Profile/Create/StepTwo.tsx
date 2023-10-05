import React from 'react';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AboutFormDataTypes } from '../../../types/profile';
import AboutForm from '../AboutForm';
import { UserType } from '../../../types/user';

interface StepTwoProps {
  onPrev: () => void;
  formStatedata: AboutFormDataTypes | null;
  onSubmit: (formStatedata: Partial<AboutFormDataTypes>) => void;
  currentUser: UserType | null;
  isLastStep: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({
  formStatedata,
  onSubmit,
  onPrev,
  currentUser,
  isLastStep,
}) => {
  const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<AboutFormDataTypes>();

  return (
    <form onSubmit={handleSubmit(formData => {
      onSubmit(formData)
    })}>
      <div>
        <AboutForm
          formStatedata={formStatedata}
          loadingData={false}
          control={control}
          register={register}
          errors={errors}
          setValue={setValue}
          defaultData={null}
          currentUser={currentUser}
        />
      </div>

      <Button
        onClick={onPrev}
        variant="outlined"
        color="primary"
        style={{ marginTop: '16px', marginRight: '16px' }}
      >
        Previous
      </Button>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: '16px' }}
      >
        {isLastStep ? 'Finish' : 'Next'}
      </Button>
    </form>
  );
}

export default StepTwo;
