import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#40A578', // vibrant, fresh green (for buttons, accents)
    },
    secondary: {
      main: '#3D8D7A', // teal-green accent
    },
    background: {
      default: '#16281f', // dark green, not black
      paper: '#255F38', // lighter, fresh green for cards and surfaces
    },
    text: {
      primary: '#E6FFF2', // very light greenish white for contrast
      secondary: '#A7D7C5', // soft muted green
    },
    success: {
      main: '#00712D', // strong green for success
    },
    info: {
      main: '#3F7D58', // muted green for info
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '--mui-background-default': '#16281f',
          '--mui-text-primary': '#E6FFF2',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#255F38', // cards and surfaces
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a3a29', // header, slightly lighter than background
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#22c55e', // vivid green
    },
    secondary: {
      main: '#14b8a6', // teal accent
    },
    background: {
      default: '#d6f5e3', // softer pale green
      paper: '#f4f7f5', // gentle off-white with a hint of green
    },
    text: {
      primary: '#23422e', // darker green for better contrast
      secondary: '#3a7d44', // muted green
    },
    success: {
      main: '#22c55e',
    },
    info: {
      main: '#14b8a6',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '--mui-background-default': '#d6f5e3',
          '--mui-text-primary': '#23422e',
        },
      },
    },
  },
});
