import React from 'react';
import { Button, Typography } from '@mui/material';
import LinksCreator from '../LinksCreator';
import { LinkType } from '../../../types/profile';

interface StepFourProps {
  onNext: () => void;
  onPrev: () => void;
  links: {
    social: LinkType[];
    custom: LinkType[];
  };
  setLinks: React.Dispatch<React.SetStateAction<{
    social: LinkType[];
    custom: LinkType[];
  }>>;
  isLastStep: boolean;
}


const StepFour: React.FC<StepFourProps> = ({
  onNext,
  onPrev,
  links,
  setLinks,
  isLastStep,
}) => {
  const processLinks = () => {
    console.log(links);
    onNext()
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Links</Typography>

      <LinksCreator
        setLinks={setLinks}
        links={links}
      />

      <div>
        <Button onClick={onPrev}>Previous</Button>
        <Button onClick={processLinks}>{isLastStep ? 'Finish' : 'Next'}</Button>
      </div>
    </div>
  );
}

export default StepFour;
