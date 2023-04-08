import React from 'react'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { AppBar } from '@/components/admin/drawer';
import { useTheme } from '@mui/material/styles';

interface HeaderProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

export default function Header({ open, handleDrawerToggle }: HeaderProps) {
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
              
              // ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar>
  )
}
