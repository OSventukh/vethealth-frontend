import { useState, ReactElement } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import CssBaseline from '@mui/material/CssBaseline';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactElement;
}

export default function AdminPanelLayout(props: LayoutProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: 'flex', background: '#fff', minHeight: '100vh' }}>
      <CssBaseline />
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Navigation
        open={open}
        handleDrawerToggle={handleDrawerToggle}
        theme={theme}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '65px',
          background: '#eef2f6',
          borderRadius: '10px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}
