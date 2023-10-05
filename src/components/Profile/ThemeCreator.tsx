import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Drawer from '@mui/material/Drawer';
import { Button, Typography, Grid, Switch } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { lightTheme, darkTheme } from '../../theme/main';
import { themeColors, appDefaultTheme, appDefaultColor, appDefaultSocialLinksToSelectedColor, socialPlatforms } from '../../setup/setup';
import { DefaultLayoutIcon, BusinessLayoutIcon, CardLayoutIcon, SocialLayoutIcon } from '../../Layout/CustomIcons'
import SocialIcon from './SocialIcon';
import { StyledIconButton } from './styles';
import { hexToRgb } from '@mui/material';
import { StyledSketchPicker } from './styles';
import { ThemeSettingsType, ColorType } from '../../types/profile';

type ThemeProps = {
  data: ThemeSettingsType;
  setData: React.Dispatch<React.SetStateAction<ThemeSettingsType>>;
  favoriteColors?: ColorType[] | null; 
  setFavoriteColors?: React.Dispatch<React.SetStateAction<ColorType[]>> | null; 
};

type PlatformType = "facebook" | "instagram" | "linkedin";
const platforms: PlatformType[] = ['facebook', 'instagram', 'linkedin'];


const ThemeCreator: React.FC<ThemeProps> = ({
  data,
  setData,
  favoriteColors,
  setFavoriteColors,
}) => {
  const [selectedColorCode, setSelectedColorCode] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [socialLinksToSelectedColor, setSocialLinksToSelectedColor] = useState<boolean>(appDefaultSocialLinksToSelectedColor);

  const { register } = useForm();
  const themeColor = selectedTheme && selectedTheme === 'dark' ? darkTheme.palette.background.default : lightTheme.palette.background.default
  const dataThemeColor = data && data.theme  === 'dark' ? darkTheme.palette.background.default : lightTheme.palette.background.default
  const defaultThemeColor = appDefaultTheme === 'dark' ? darkTheme.palette.background.default : lightTheme.palette.background.default;
  
  const currentThemeColor = selectedTheme ? themeColor : (data ? dataThemeColor : defaultThemeColor);
  const currentColor = selectedColorCode || data.selectedColor.code || appDefaultColor.code
  const currentTheme = selectedTheme || data.theme ||appDefaultTheme

  const layouts = [
    { name: 'default', icon: DefaultLayoutIcon(themeColor || defaultThemeColor, selectedColorCode || appDefaultColor.code), label: 'Default' },
    { name: 'business', icon: BusinessLayoutIcon(themeColor || defaultThemeColor, selectedColorCode || appDefaultColor.code), label: 'Business' },
    { name: 'card', icon: CardLayoutIcon(themeColor || defaultThemeColor, selectedColorCode || appDefaultColor.code), label: 'Card' },
    { name: 'social', icon: SocialLayoutIcon(themeColor || defaultThemeColor, selectedColorCode || appDefaultColor.code), label: 'Social' },
  ];

  const combinedColors = useMemo(() => {
    const favorites = (favoriteColors || []).map(color => ({ name: 'custom', code: color.code }));
  
    if (favorites.length >= 6) {
      return favorites.slice(0, 6);
    }
  
    return [...favorites, ...themeColors.slice(0, 6 - favorites.length)];
  }, [favoriteColors]);

  useEffect(() => {
    if (data?.socialLinksToSelectedColor !== undefined) {
      setSocialLinksToSelectedColor(data.socialLinksToSelectedColor);
    }
  }, [data?.socialLinksToSelectedColor]);

  const handleSelectLayout = (layout: ThemeSettingsType['layout']) => {
    setData(prev => ({ ...prev, layout }));
  };
  
  const handleSelectTheme = (theme: ThemeSettingsType['theme']) => {
    setSelectedTheme(theme)
    setData(prev => ({ ...prev, theme }));
  };

  const handleSocialLinksToSelectedColor = () => {
    setSocialLinksToSelectedColor(prev => !prev)
    setData(prev => ({ ...prev, socialLinksToSelectedColor: !data.socialLinksToSelectedColor }));
  };

  const handleSaveColor = () => {
    if (selectedColorCode) {
      const newColor: ColorType = { name: 'custom', code: selectedColorCode };
      if (!favoriteColors?.find(color => color.code === newColor.code)) {
        setFavoriteColors?.((prevColors) => [...prevColors, newColor]);
      }
    }
    setPickerOpen(false)
  };

  return (
    <div>
      <div>
        <Typography variant="h5">Select Layout</Typography>
        <Grid container spacing={2}>
          {layouts.map((layout) => (
            <Grid item key={layout.name}>
              <StyledIconButton
                color={data.layout === layout.name ? 'primary' : 'default'}
                onClick={() => handleSelectLayout(layout.name as ThemeSettingsType['layout'])}
                {...register('layout')}
              >
                <layout.icon background={currentThemeColor} selectedcolor={currentColor} />
              </StyledIconButton>
              <Typography align="center">
                {data.layout === layout.name && <CheckCircleIcon style={{ color: '#000' }} />}
                {layout.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </div>

      <div>
        <Typography variant="h5" style={{ marginTop: '16px' }}>Select Theme</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <div 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: lightTheme.palette.background.default,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #888'
              }}
              onClick={() => handleSelectTheme('light')}
            >
              {currentTheme === 'light' && <CheckIcon style={{ color: '#000' }} />}
            </div>
            <Typography align="center">Light</Typography>
          </Grid>
          <Grid item>
            <div 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: darkTheme.palette.background.default,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => handleSelectTheme('dark')}
            >
              {currentTheme === 'dark' && <CheckIcon style={{ color: '#fff' }} />}
            </div>
            <Typography align="center">Dark</Typography>
          </Grid>
        </Grid>
      </div>

      <div>
        <Typography variant="h5" style={{ marginTop: '16px' }}>Select main color</Typography>
        <Grid container spacing={2}>
          {combinedColors.map((color) => (
            <Grid item key={color.code}>
              <div 
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: color.code,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => {
                  if (typeof color.code === 'string') {
                    setSelectedColorCode(color.code);
                    setData(prev => ({ ...prev, selectedColor: color }));
                  }
                }}
              >
                {currentColor === color.code && <CheckIcon style={{ color: '#fff' }} />}
              </div>
              <Typography align="center">{color.name}</Typography>
            </Grid>
          ))}
        </Grid>
        <Button onClick={() => setPickerOpen(true)}>Pick Color</Button>
      </div>

      <div>
        <Typography variant="h5" style={{ marginTop: '16px' }}>Social icons color</Typography>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Typography variant="body1" style={{ marginRight: '8px' }}>Match icons color to selected color:</Typography>
          <Switch 
            checked={socialLinksToSelectedColor} 
            onChange={() => handleSocialLinksToSelectedColor()} 
          />
        </div>
        
        <Grid container spacing={2}>
          {platforms.map(platform => {
            const platformInfo = socialPlatforms.find(p => p.platform === platform);
            if (!platformInfo) return null;
            return (
              <Grid item key={platform}>
                <SocialIcon platform={platform} iconColor={socialLinksToSelectedColor ? currentColor : undefined} />
                <Typography align="center">{platform}</Typography>
              </Grid>
            );
          })}
        </Grid>
      </div>


      <Drawer anchor="bottom" open={isPickerOpen} onClose={() => setPickerOpen(false)}>
        <StyledSketchPicker 
            color={selectedColorCode ? hexToRgb(selectedColorCode) : { r: 255, g: 255, b: 255, a: 1 }}
            onChangeComplete={(color) => {
                setSelectedColorCode(color.hex);
                setData(prev => ({ ...prev, selectedColor: { name: 'picker', code: color.hex } }));
            }}
            styles={{
                default: {
                    picker: {
                        width: '100%',
                        boxShadow: 'none',
                        padding: 0,
                        margin: 0,
                        borderRadius: 0,
                    }
                }
            }}
        />
        <Button onClick={handleSaveColor}>Save Color</Button>
      </Drawer>
    </div>
  );
};

export default ThemeCreator;
