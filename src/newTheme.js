//Your theme for the new stuff using material UI has been copied here so it doesn't conflict
import { createTheme } from '@material-ui/core/styles';

const newTheme = createTheme({
  palette: {
    type: 'light',
    text: {
      primary: '#dddfee',
      secondary: 'white',
      yellow: '#f9d749',
    },
    background: {
      default: '#121212',
      paper: '#0d2a56',
    },
    primary: {
      light: '#ffe066',
      main: '#2c2560',
      dark: '#b38f00',
      contrastText: '#000',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    action: {
      disabledBackground: '#CDCDCD',
      active: '#000',
      hover: '#fff',
    },
  },
  typography: {
    color: '#2c2560',
    fontFamily: ['"Rubik"', 'sans-serif'].join(','),
  },
  container: {
    root: {
      '(min-width: 1280px)': {
        maxWidth: 1368,
      },
    },
  },
  alert: {
    a: {
      color: 'inherit',
    },
  },
});

export default newTheme;
