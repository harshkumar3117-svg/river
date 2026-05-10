import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4d8',
      light: '#48cae4',
      dark: '#0077b6',
    },
    secondary: {
      main: '#f77f00',
      light: '#fcbf49',
      dark: '#d62828',
    },
    error: {
      main: '#ef233c',
    },
    warning: {
      main: '#f77f00',
    },
    info: {
      main: '#00b4d8',
    },
    success: {
      main: '#06d6a0',
    },
    background: {
      default: '#020917',
      paper: 'rgba(13, 27, 52, 0.7)',
    },
    text: {
      primary: '#e8f4fd',
      secondary: '#90caf9',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
