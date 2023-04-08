import { useState, ReactElement } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import CssBaseline from '@mui/material/CssBaseline';
import Header from './Header';
import Navigation from './Navigation';
import type { ChildrenProps } from '@/types/props-types';

export default function AdminPanelLayout(props: ChildrenProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline enableColorScheme />
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Navigation
        open={open}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '65px',
          marginRight: '1vw',
          background: theme.palette.background.content,
          borderRadius: '10px 10px 0 0',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}
