import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';
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
import { layoutStyles } from '../../../theme/layout';

const Theme: React.FC = () => {
  const layoutClasses = layoutStyles()
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
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
    const themeChanged = !_.isEqual(initialThemeData.current, themeSettings);
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
    setFormValid(true)
    setFormChanged(themeChanged);
  }, [checkIfThemeChanged, setFormChanged, setFormValid]);

  return (
    <Box>
      <ThemeCreator
        data={themeSettings}
        setData={setThemeSettings}
        favoriteColors={favoriteColors}
        setFavoriteColors={setFavoriteColors}
      />
      <Box
          className={layoutClasses.stickyBottomBox}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            onClick={handleThemeSubmit}
            fullWidth
            variant="contained"
            color="primary"
            disabled={!formValid || !formChanged}
          >
            Save
          </Button>
        </Box>
    </Box>
  );
};

export default Theme;
