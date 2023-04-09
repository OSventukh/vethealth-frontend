import React from 'react'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { AppBar } from '@/components/admin/Layout/drawer';
import { useTheme } from '@mui/material/styles';
import type { NavigationProps } from '@/types/props-types';


export default function Header({ open, handleDrawerToggle }: NavigationProps) {
  const theme = useTheme();
  return (
    <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant='h5' color='text'>VETHEALTH</Typography>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              background: (theme.palette.primary as any).main,
              borderRadius: '10px',
              p:'5px',
              marginLeft: 5
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
  )
}
