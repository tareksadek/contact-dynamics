import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import BasicInfoForm from '../BasicInfoForm';
import { BasicInfoFormDataTypes } from '../../../types/profile';
import { UserType } from '../../../types/user';
import { stepsStyles } from './styles';

interface StepOneProps {
  formStatedata: BasicInfoFormDataTypes | null;
  location: {
    lat: number, 
    lng: number
  } | null;
  setLocation: (location: { lat: number, lng: number } | null) => void;
  onPrev: () => void;
  onSubmit: (formStatedata: Partial<BasicInfoFormDataTypes>) => void;
  currentUser: UserType | null;
  loadingUser: boolean;
  isFirstStep: boolean;
}

const StepOne: React.FC<StepOneProps> = ({
  formStatedata,
  location,
  setLocation,
  onPrev,
  onSubmit,
  currentUser,
  loadingUser,
  isFirstStep,
}) => {
  const classes = stepsStyles();
  const { control, register, handleSubmit, formState: { errors, isValid }, setValue } = useForm<BasicInfoFormDataTypes>({
    defaultValues: {
      firstName: formStatedata?.firstName || (currentUser ? currentUser?.firstName : ''),
      lastName: formStatedata?.lastName || (currentUser ? currentUser?.lastName : ''),
      email: formStatedata?.email || (currentUser ? currentUser?.loginEmail : ''),
      phone1: "",
      phone2: "",
      address: "",
      organization: "",
      position: "",
    },
    mode: 'onBlur',
  });
  

  return (
    <form
      onSubmit={handleSubmit(formData => {
        onSubmit(formData)
      })}
    >
      <Box mt={2}>
        <Typography variant="h4" align="center">Basic Info</Typography>
      </Box>

      <BasicInfoForm
        formStatedata={formStatedata}
        location={location}
        setLocation={setLocation}
        loadingData={loadingUser}
        control={control}
        register={register}
        errors={errors}
        setValue={setValue}
        currentUser={currentUser}
        defaultData={currentUser}
      />
      {!isFirstStep && (
        <Button onClick={onPrev}>Previous</Button>
      )}
      <Box
        className={classes.stickyBox}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          type="submit"
          fullWidth={isFirstStep}
          variant="contained"
          color="primary"
          disabled={!isValid}
        >
          Next
        </Button>
      </Box>
    </form>
  );
}

export default StepOne;
