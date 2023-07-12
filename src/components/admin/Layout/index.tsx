import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material/';
import Header from './Header';
import Navigation from './Navigation';
import { replacePropertyName } from '@/utils/replacePropertyName';
import type { ChildrenProps } from '@/types/props-types';
import { Roboto } from 'next/font/google';
import { signIn, useSession } from 'next-auth/react';

const roboto = Roboto({ subsets: ['latin', 'cyrillic'], weight: '400' });

export default function AdminPanelLayout(props: ChildrenProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn();
    }
  }, [session]);
  return (
    <Box
      className={roboto.className}
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: theme.palette.background.paper,
      }}
    >
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
