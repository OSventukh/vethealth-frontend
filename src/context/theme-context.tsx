import { createContext } from 'react';
import type { ThemeContext } from '@/types/ui-types';

const ColorModeContext = createContext<ThemeContext>({
  toggleColorMode: () => {},
  mode: 'light',
});

export default ColorModeContext;
