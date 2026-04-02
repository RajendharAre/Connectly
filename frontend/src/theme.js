import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E88E5',      // Primary Blue (TaskPlanet)
      dark: '#1565C0',      // Primary Dark
      light: '#42A5F5',     // Primary Light
    },
    secondary: {
      main: '#FF6F61',      // Accent Orange
    },
    background: {
      default: '#F5F7FA',   // Light Background
      paper: '#FFFFFF',     // Card/Paper Background
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FFC107',
    },
    text: {
      primary: '#212121',   // Text Primary
      secondary: '#6B7280', // Text Secondary
      disabled: '#D1D5DB',  // Disabled Text
    },
    divider: '#E5E7EB',     // Border Color
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

export default theme;
