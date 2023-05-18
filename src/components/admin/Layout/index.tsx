import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material/';
import Header from './Header';
import Navigation from './Navigation';
import { replacePropertyName } from '@/utils/replacePropertyName';
import type { ChildrenProps } from '@/types/props-types';
import { useSession, signIn } from 'next-auth/react';

export default function AdminPanelLayout(props: ChildrenProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession()

  const handleDrawerToggle = () => {
    setOpen((prevState) => !prevState);
  };

  // redirect to login page if refresh token is failed
  useEffect(() => {
    if (session?.error && session.error === 'RefreshAccessTokenError') {
      signIn();
    }
  }, [session]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Navigation open={open} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: theme.mixins.toolbar,
          marginRight: '1vw',
          background: theme.palette.background.content,
          borderRadius: '10px 10px 0 0',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          ...replacePropertyName(
            theme.mixins.toolbar,
            'minHeight',
            'marginTop'
          ),
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}
