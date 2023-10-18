import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Timestamp } from '@firebase/firestore';
import { Container, Box, Typography, Stepper, Step, StepLabel } from '@mui/material';
import StepZero from '../../../components/Profile/Create/StepZero';
import StepOne from '../../../components/Profile/Create/StepOne';
import StepTwo from '../../../components/Profile/Create/StepTwo';
import StepThree from '../../../components/Profile/Create/StepThree';
import StepFour from '../../../components/Profile/Create/StepFour';
import StepFive from '../../../components/Profile/Create/StepFive';
import {
  appDefaultTheme,
  appDefaultColor,
  appDefaultLayout,
  appDefaultSocialLinksToSelectedColor,
} from '../../../setup/setup';
import {
  BasicInfoFormDataTypes,
  AboutFormDataTypes,
  LinkType,
  ThemeSettingsType,
  ColorType,
  ImageType,
} from '../../../types/profile';
import { RootState, AppDispatch } from '../../../store/reducers';
import { replaceEmptyOrUndefinedWithNull } from '../../../utilities/utils';
import { saveProfile } from '../../../store/actions/profile';

const CreateProfile: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [profileTitle, setProfileTitle] = useState<string | null>(null);
  const [basicInfoData, setBasicInfoData] = useState<BasicInfoFormDataTypes | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [aboutData, setAboutData] = useState<AboutFormDataTypes | null>(null);
  const [coverImageData, setCoverImageData] = useState<ImageType>({
    url: null,
    blob: null,
    base64: null
  });
  const [profileImageData, setProfileImageData] = useState<ImageType>({
    url: null,
    blob: null,
    base64: null
  });
  const [links, setLinks] = useState<{ social: LinkType[], custom: LinkType[] }>({ social: [], custom: [] });
  const [themeSettings, setThemeSettings] = useState<ThemeSettingsType>({
    selectedColor: appDefaultColor,
    theme: appDefaultTheme,
    layout: appDefaultLayout,
    socialLinksToSelectedColor: appDefaultSocialLinksToSelectedColor
  });
  const [favoriteColors, setFavoriteColors] = useState<ColorType[]>([]);

  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const authUser = useSelector((state: RootState) => state.authUser);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  // Dynamic steps generation
  const getSteps = () => {
    let steps = [];

    if (currentUser && currentUser.profileList && currentUser.profileList.length >= 1) {
      steps.push('title');
    }

    steps.push('info');

    if (appSetup && appSetup.aboutData && (!appSetup.aboutData.about || !appSetup.aboutData.videoUrl) && currentUser && !currentUser.isTeamMember) {
      steps.push('about');
    }

    steps.push('images');

    if (currentUser && !currentUser.isTeamMember && appSetup && !appSetup.links) {
      steps.push('links');
    }

    if (currentUser && !currentUser.isTeamMember && appSetup && !appSetup.themeSettings) {
      steps.push('theme');
    }

    return steps;
  };

  const steps = getSteps();

  const isFirstStep = useCallback(() => {
    return activeStep === 0;
  }, [activeStep]);

  const isLastStep = useCallback(() => {
    return activeStep === steps.length - 1;
  }, [activeStep, steps]);

  const handleNext = useCallback(() => {
    if (isLastStep()) {
      if (basicInfoData) {
        basicInfoData.location = location
      }

      let profileData = {
        title: profileTitle || 'default',
        basicInfoData: basicInfoData,
        aboutData: aboutData,
        coverImageData: coverImageData,
        profileImageData: profileImageData,
        contactFormData: {
          formProvider: 'default',
          embedCode: '',
        },
        links,
        themeSettings,
        favoriteColors,
        createdOn: Timestamp.now().toDate(),
      };

      // Apply the utility function to replace empty strings and undefined with null
      profileData = replaceEmptyOrUndefinedWithNull(profileData);

      // Dispatch saveProfile action. Use authUser.userId for the userId
      if (authUser.userId) {
        dispatch(saveProfile(authUser.userId, profileData));
      }

      if (currentUser) {
        navigate(`/${currentUser?.profileUrlSuffix}`);
      }

    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }, [
    profileTitle,
    basicInfoData,
    aboutData,
    coverImageData,
    profileImageData,
    links,
    themeSettings,
    favoriteColors,
    authUser,
    dispatch,
    isLastStep,
    location,
    navigate,
    currentUser,
  ]);

  const handlePrev = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
  }, []);

  const handleTitleSubmit = (formData: string) => {
    setProfileTitle(formData)
    handleNext()
  };

  const handleBasicInfoSubmit = (formData: Partial<BasicInfoFormDataTypes>) => {
    setBasicInfoData(formData)
    handleNext()
  };

  const handleAboutSubmit = (formData: Partial<AboutFormDataTypes>) => {
    setAboutData(formData)
    handleNext()
  };

  // console.log(basicInfoData);
  // console.log(aboutData);
  // console.log(coverImageData);
  // console.log(profileImageData);
  // console.log(links);
  // console.log(themeSettings);

  const stepComponents: { [key: string]: JSX.Element } = {
    'title': <StepZero
      formStatedata={profileTitle}
      onSubmit={handleTitleSubmit}
      currentUser={currentUser}
      loadingUser={isLoading}
    />,
    'info': <StepOne
      formStatedata={basicInfoData}
      location={location}
      setLocation={setLocation}
      onPrev={handlePrev}
      onSubmit={handleBasicInfoSubmit}
      currentUser={currentUser}
      loadingUser={isLoading}
      isFirstStep={isFirstStep()}
    />,
    'about': <StepTwo
      formStatedata={aboutData}
      onSubmit={handleAboutSubmit}
      onPrev={handlePrev}
      currentUser={currentUser}
      isLastStep={isLastStep()}
    />,
    'images': <StepThree
      onNext={handleNext}
      onPrev={handlePrev}
      coverImageData={coverImageData}
      setCoverImageData={setCoverImageData}
      initialCoverImage={null}
      profileImageData={profileImageData}
      setProfileImageData={setProfileImageData}
      initialProfileImage={null}
      currentUser={currentUser}
      isLastStep={isLastStep()}
    />,
    'links': <StepFour
      onNext={handleNext}
      onPrev={handlePrev}
      links={links}
      setLinks={setLinks}
      isLastStep={isLastStep()}
    />,
    'theme': <StepFive
      onNext={handleNext}
      onPrev={handlePrev}
      data={themeSettings}
      setData={setThemeSettings}
      favoriteColors={favoriteColors}
      setFavoriteColors={setFavoriteColors}
      isLastStep={isLastStep()}
    />
  };

  console.log(getSteps());


  if (!isLoading) {
    return (
      <Box>
        <Box pt={2}>
          <Typography variant="h3" align="center">Create Your Digital Card</Typography>
          <Box mt={2} mb={3}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {getSteps().map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          {stepComponents[getSteps()[activeStep]]}
        </Box>
      </Box>
    );
  } else {
    return null;
  }

}

export default CreateProfile;

