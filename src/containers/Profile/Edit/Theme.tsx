import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import ThemeCreator from '../../../components/Profile/ThemeCreator';
import { ThemeSettingsType, ColorType } from '../../../types/profile';
import {
  appDefaultTheme,
  appDefaultColor,
  appDefaultLayout,
  appDefaultSocialLinksToSelectedColor,
} from '../../../setup/setup';
import { RootState, AppDispatch } from '../../../store/reducers';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { updateThemeSettingsData } from '../../../store/actions/profile';

const Theme: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [themeSettings, setThemeSettings] = useState<ThemeSettingsType>({
    selectedColor: appDefaultColor,
    theme: appDefaultTheme,
    layout: appDefaultLayout,
    socialLinksToSelectedColor: appDefaultSocialLinksToSelectedColor
  });
  const [favoriteColors, setFavoriteColors] = useState<ColorType[]>([]); 

  const initialThemeData = useRef<ThemeSettingsType>(themeSettings);

  const checkIfThemeChanged = useCallback(() => {
    const themeChanged = JSON.stringify(initialThemeData.current) !== JSON.stringify(themeSettings);
    return themeChanged
  }, [themeSettings]);

  const handleThemeSubmit = useCallback(() => {
    if (!authUser?.userId || !user) {
      return;
    }
    const themeChanged = checkIfThemeChanged();

    if (themeChanged) {
      dispatch(updateThemeSettingsData(authUser?.userId, user.activeProfileId, themeSettings, favoriteColors))
    }
    
  }, [authUser?.userId, user, checkIfThemeChanged, dispatch, themeSettings, favoriteColors]);

  useEffect(() => {
    if (profile && profile.themeSettings) {
      setThemeSettings(profile.themeSettings)
      initialThemeData.current = profile.themeSettings;
    }
    if (profile && profile.favoriteColors) {
      setFavoriteColors(profile.favoriteColors)
    }
  }, [profile]);

  useEffect(() => {
    registerSubmit(handleThemeSubmit);
  }, [registerSubmit, handleThemeSubmit]);

  useEffect(() => {
    const themeChanged = checkIfThemeChanged();
    console.log(themeChanged);
    setFormValid(true)
    setFormChanged(themeChanged);
  }, [checkIfThemeChanged, setFormChanged, setFormValid]);

  return (
    <div>
      <Typography variant="h5">Profile Design</Typography>

      <ThemeCreator
        data={themeSettings}
        setData={setThemeSettings}
        favoriteColors={favoriteColors}
        setFavoriteColors={setFavoriteColors}
      />
    </div>
  );
};

export default Theme;
