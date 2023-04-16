import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material/';
import { light } from './light';
import { dark } from './dark';
import { ReactElement } from 'react';
import ColorModeContext from '@/context/theme-context';

interface ThemeProps {
  children: ReactElement;
}

export default function Theme(props: ThemeProps) {
  const [mode, setMode] = useState<PaletteMode>('light');

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light'
        );
      },
      mode: mode,
    }),
    [mode]
  );

  useEffect(() => {
    const savedMode = (localStorage.getItem('mode') as PaletteMode) || null;
    setMode((prevMode) => prevMode !== savedMode ? savedMode : prevMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);

  const themes = {
    light: light,
    dark: dark,
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={themes[mode]}>{props.children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
