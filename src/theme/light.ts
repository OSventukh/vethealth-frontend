import { createTheme } from '@mui/material/styles';

export const light = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fff',
      paper: '#fff',
      content: '#eef2f6'
    }
  },
  mixins: {
    toolbar: {
      minHeight: 80,
    }
  }
})
