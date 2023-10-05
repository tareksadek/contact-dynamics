import React, { ReactNode, useState } from 'react';
import { ProfileWizardContext } from '../contexts/ProfileWizardContext'

interface ProfileWizardProviderProps {
  children: ReactNode;
}

export const ProfileWizardProvider: React.FC<ProfileWizardProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({});

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  return (
    <ProfileWizardContext.Provider value={{ currentStep, profileData, setProfileData, nextStep }}>
      {children}
    </ProfileWizardContext.Provider>
  );
};