import { createTheme } from '@mui/material/styles';
import './fonts.css';

const globalTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, Montserrat, Cairo',

    // Override specific variants
    h1: {
      fontFamily: 'Montserrat', // for example, if you want h1 to predominantly use Montserrat
      fontWeight: 700, // Roboto Bold
    },
    body1: {
      fontFamily: 'Roboto',
      fontWeight: 700,
    },
    // ... Any other typography variant overrides you'd like
  },

  components: {
    // For overriding MUI components
    MuiTypography: {
      styleOverrides: {
        root: {
          // General overrides for all Typography components
        },
        h1: {
          // Specific overrides for 'h1' variant
        },
        body1: {
          // Specific overrides for 'body1' variant
        },
        // ... Other specific overrides
      },
    },
  },
});

const lightTheme = createTheme(globalTheme, {
  palette: {
    mode: 'light', // This will automatically set some of the internal MUI colors for light mode
    background: {
      default: '#fff',
    },
    text: {
      primary: '#000',
    },
  },
  typography: {
    fontFamily: 'Roboto, Montserrat, Cairo',
  },
  // ... rest of your theme configuration for the light mode
});

// Dark theme
const darkTheme = createTheme(globalTheme, {
  palette: {
    mode: 'dark', // This will automatically set some of the internal MUI colors for dark mode
    background: {
      default: '#000',
    },
    text: {
      primary: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Montserrat, Cairo',
  },
  // ... rest of your theme configuration for the dark mode
});

export { lightTheme, darkTheme };