import { createTheme } from '@mui/material/styles';
import { PaletteColorOptions  } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      mode: 'dark' | 'light',
      primary: PaletteColorOptions,
      background: {
        content: string;
        paper: string;
        default: string;
      };
    };
  }

  interface ThemeOptions {
     palette: {
      background?: {
        content: string;
      };
    };
  }
  interface PaletteOptions {
    layout?: PaletteColorOptions;
  }

  interface TypeBackground {
    content?: string;
  }
}
