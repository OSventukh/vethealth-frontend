import { useState, useContext } from 'react';
import { Toolbar, IconButton, Typography } from '@mui/material/';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import type { NavigationProps } from '@/types/props-types';
import { AppBar } from '@/components/admin/Layout/drawer';
import UserMenu from './UserMenu';
import { Box } from '@mui/material';
import { ColorModeSwitch } from '../UI/Switch';
import ColorModeContext from '@/context/theme-context';

export default function Header({ open, handleDrawerToggle }: NavigationProps) {
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}
        >
          <Typography variant="h4" component="h1" color="text.primary">
            VETHEALTH
          </Typography>
          <IconButton
            color="primary"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              borderRadius: '10px',
              background: theme.palette.background.content,
              padding: '0.5rem',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5vw',
          }}
        >
          <ColorModeSwitch
            checked={mode === 'dark'}
            onChange={toggleColorMode}
            theme={theme}
          />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
