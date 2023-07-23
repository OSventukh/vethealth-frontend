import { useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MobileNavItem, MobileNavItemWithNested } from './MobileNavItem';
import classes from '@/styles/layout/Navigation.module.css';
import type { Category } from '@/types/content-types';

export default function MobileNavigation({ data }: { data: Category[] }) {
  const router = useRouter();
  const topic = router.query.topic;

  const [openNav, setOpenNav] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpenNav(open);
    };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {data.map((item, index) => {
          if (item.children && item.children.length > 0) {
            return (
              <MobileNavItemWithNested
                key={item.id}
                text={item.name}
                nested={item.children}
                anchor={`/${topic}?category=`}
              />
            );
          } else {
            return (
              <MobileNavItem
                key={item.id}
                text={item.name}
                link={item.slug}
                anchor={`/${topic}?category=`}
              />
            );
          }
        })}
      </List>
    </Box>
  );

  return (
    <div className={classes['mobile-menu']}>
      <IconButton size="large" onClick={toggleDrawer(true)}>
        <MenuIcon sx={{ color: 'var(--font-color)' }} />
      </IconButton>

      <Drawer
        anchor="left"
        open={openNav}
        onClose={toggleDrawer(false)}
        sx={{
          '.MuiDrawer-paper': { backgroundColor: '#1e1e1e', color: '#ececec' },
        }}
      >
        {list()}
      </Drawer>
    </div>
  );
}
