import React from 'react';
import { Button, Typography } from '@mui/material';
import ThemeCreator from '../ThemeCreator';
import { ThemeSettingsType, ColorType } from '../../../types/profile';

type StepFiveProps = {
  onNext: () => void;
  onPrev: () => void;
  data: ThemeSettingsType;
  setData: React.Dispatch<React.SetStateAction<ThemeSettingsType>>;
  favoriteColors?: ColorType[]; 
  setFavoriteColors?: React.Dispatch<React.SetStateAction<ColorType[]>>;
  isLastStep: boolean;
};

const StepFive: React.FC<StepFiveProps> = ({
  onNext,
  onPrev,
  data,
  setData,
  favoriteColors,
  setFavoriteColors,
  isLastStep,
}) => {

  return (
    <div>
      <Typography variant="h5">Profile Design</Typography>

      <ThemeCreator
        data={data}
        setData={setData}
        favoriteColors={favoriteColors}
        setFavoriteColors={setFavoriteColors}
      />

      <Button onClick={onPrev}>Previous</Button>
      <Button onClick={onNext}>{isLastStep ? 'Finish' : 'Next'}</Button>
    </div>
  );
};

export default StepFive;
