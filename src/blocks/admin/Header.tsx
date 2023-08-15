import { useContext } from 'react';
import { Toolbar, IconButton, Typography } from '@mui/material/';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import type { NavigationProps } from '@/types/props-types';
import { AppBar } from '@/components/admin/Layout/drawer';
import UserMenu from '../../components/admin/Layout/UserMenu';
import { Box } from '@mui/material';
import { ColorModeSwitch } from '../../components/admin/UI/Switch';
import ColorModeContext from '@/context/theme-context';
import Link from 'next/link';
import Logo from '../../components/admin/Layout/Logo';

export default function Header({ open, handleDrawerToggle }: NavigationProps) {
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}
        >
          <Link href="/admin">
            <Typography variant="h4" component="h1" color="text.primary" sx={{p: 0}}>
              <Logo color="currentColor" />
            </Typography>
          </Link>
          <IconButton
            color="primary"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              borderRadius: '10px',
              background: theme.palette.background.content,
              // padding: '0.5rem',
              height: '2.7rem',
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
