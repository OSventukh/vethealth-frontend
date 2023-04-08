import { ThemeProvider } from '@mui/material/styles';
import { light } from './light';
import { dark } from './dark';
import { ReactElement } from 'react';

interface ThemeProps {
  children: ReactElement
}
export default function Theme(props: ThemeProps) {
  return <ThemeProvider theme={dark}>{props.children}</ThemeProvider>
}