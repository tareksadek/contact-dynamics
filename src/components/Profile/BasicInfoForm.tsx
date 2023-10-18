import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Geocode from 'react-geocode';
import { Typography, TextField, CircularProgress } from '@mui/material';
import GoogleMapDisplay from './GoogleMapDisplay';
import { Controller } from 'react-hook-form';
import { GOOGLE_MAPS_KEY } from '../../setup/setup';
import { BasicInfoFormDataTypes } from '../../types/profile';
import { UserType } from '../../types/user';
import { RootState } from '../../store/reducers';

interface BasicInfoProps {
  formStatedata: BasicInfoFormDataTypes | null;
  location: {
    lat: number, 
    lng: number
  } | null;
  setLocation: (location: { lat: number, lng: number } | null) => void;
  control: any;
  register: any;
  loadingData: boolean;
  setValue: any;
  errors: any;
  currentUser: UserType | null;
  defaultData: any;
  currentAddress?: string | null;
}

Geocode.setApiKey(GOOGLE_MAPS_KEY);

const BasicInfoForm: React.FC<BasicInfoProps> = ({
  formStatedata,
  loadingData,
  control,
  setValue,
  errors,
  currentUser,
  currentAddress,
  location,
  setLocation,
}) => {  
  
  const [mapError, setMapError] = useState<string | null>(null)  

  const appSetup = useSelector((state: RootState) => state.setup.setup);  

  // useEffect(() => {
  //   if (defaultData) {
  //     setValue("firstName", formStatedata && formStatedata.firstName ? formStatedata.firstName : defaultData.firstName);
  //     setValue("lastName", formStatedata && formStatedata?.lastName ? formStatedata.lastName : defaultData.lastName);
  //     setValue("email", formStatedata && formStatedata.email ? formStatedata.email : defaultData.loginEmail);
  //   }
  // }, [defaultData, setValue, formStatedata]);

  const handleAddressChange = useCallback(async (address: string) => {
    try {
      const response = await Geocode.fromAddress(address);
      const { lat, lng } = response.results[0].geometry.location;
      setLocation({ lat, lng });
      setMapError(null)
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching location:", error.message);
  
        if (error.message.includes("ZERO_RESULTS")) {
          setMapError("We couldn't find that address. Please check and try again.")
        } else {
          setMapError("We couldn't find that address. Please check and try again.")
        }
        setLocation(null)
      }
    }
  }, [setLocation, setMapError]);
  
  useEffect(() => {
    if (currentAddress) {
      handleAddressChange(currentAddress)
    }
  }, [currentAddress, handleAddressChange]);

  return (
    <div>
      <Controller
        name="firstName"
        control={control}
        rules={{ required: 'First name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="First Name*"
            disabled={loadingData && !formStatedata?.firstName}
            InputProps={{
              endAdornment: loadingData && !formStatedata?.firstName ? <CircularProgress size={20} /> : null
            }}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
          />
        )}
      />
      {/* <Typography color="error">
        {errors.firstName && errors.firstName.message}
      </Typography> */}

      <Controller
        name="lastName"
        control={control}
        rules={{ required: 'Last name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Last Name*"
            disabled={loadingData}
            InputProps={{
              endAdornment: loadingData ? <CircularProgress size={20} /> : null
            }}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
          />
        )}
      />
      {/* <Typography color="error">
        {errors.lastName && errors.lastName.message}
      </Typography> */}
      
      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid email format"
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="E-mail*"
            disabled={loadingData}
            InputProps={{
              endAdornment: loadingData ? <CircularProgress size={20} /> : null
            }}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
        )}
      />
      {/* <Typography color="error">
        {errors.email && errors.email.message}
      </Typography> */}

      {appSetup && appSetup.basicInfoData && !appSetup.basicInfoData.organization && !currentUser?.isTeamMember && (
        <Controller
          name="organization"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Organization"
              disabled={loadingData}
              InputProps={{
                endAdornment: loadingData ? <CircularProgress size={20} /> : null
              }}
              error={Boolean(errors.organization)}
              helperText={errors.organization?.message}
            />
          )}
        />
      )}
      
      <Controller
        name="position"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Position"
            disabled={loadingData}
            InputProps={{
              endAdornment: loadingData ? <CircularProgress size={20} /> : null
            }}
            error={Boolean(errors.position)}
            helperText={errors.position?.message}
          />
        )}
      />

      <Controller
        name="phone1"
        control={control}
        rules={{
          pattern: {
            value: /^[0-9+\-. ]+$/,
            message: "Invalid phone number."
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Phone Number 1"
            disabled={loadingData}
            InputProps={{
              endAdornment: loadingData ? <CircularProgress size={20} /> : null
            }}
            error={Boolean(errors.phone1)}
            helperText={errors.phone1?.message}
          />
        )}
      />

      <Controller
        name="phone2"
        control={control}
        rules={{
          pattern: {
            value: /^[0-9+\-. ]+$/,
            message: "Invalid phone number."
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Phone Number 2"
            disabled={loadingData}
            InputProps={{
              endAdornment: loadingData ? <CircularProgress size={20} /> : null
            }}
            error={Boolean(errors.phone2)}
            helperText={errors.phone2?.message}
          />
        )}
      />
      {appSetup && appSetup.basicInfoData && !appSetup.basicInfoData.address && !currentUser?.isTeamMember && (
        <>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Address"
                error={Boolean(errors.address)}
                disabled={loadingData}
                InputProps={{
                  endAdornment: loadingData ? <CircularProgress size={20} /> : null
                }}
                helperText={errors.address?.message}
                onChange={e => {
                  field.onChange(e);
                  handleAddressChange(e.target.value);
                }}
              />
            )}
          />
          {location && (
            <GoogleMapDisplay lat={location.lat} lng={location.lng} />
          )}
          {mapError && (
            <Typography color="error">
              {mapError}
            </Typography>
          )}
        </>
      )}
    </div>
  );
}

export default BasicInfoForm;
