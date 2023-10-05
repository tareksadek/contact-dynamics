import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const AppLayoutContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default, // Example color from theme
  maxWidth: 550,
  // You can add more styles as needed
}));

export { AppLayoutContainer };