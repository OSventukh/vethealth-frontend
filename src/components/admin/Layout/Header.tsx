import React from 'react';
import {Toolbar, IconButton, Typography } from '@mui/material/';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import type { NavigationProps } from '@/types/props-types';
import { AppBar } from '@/components/admin/Layout/drawer';
import UserMenu from './UserMenu';
import { Box } from '@mui/material';

export default function Header({ open, handleDrawerToggle }: NavigationProps) {
  const theme = useTheme();
  return (
    <AppBar position="fixed" open={open}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
        <Box sx={{display: 'flex'}}>
          <Typography variant="h5" color="text">
            VETHEALTH
          </Typography>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              background: (theme.palette.primary as any).main,
              borderRadius: '10px',
              p: '5px',
              marginLeft: 5,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
