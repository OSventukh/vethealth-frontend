import { createTheme } from "@mui/material";

export const dark = createTheme({
  palette: {
    mode: 'dark',
    background: {
      content: '#595959',
      paper: '#3d3d3d',
      default: '#3d3d3d'
    }
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent'
        }
      }
    }
  }
});
