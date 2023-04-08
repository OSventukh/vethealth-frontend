import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import { Drawer, DrawerHeader } from '@/components/admin/drawer';
import type { NavigationProps } from '@/types/props-types';

export default function Navigation({ open }: NavigationProps) {
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader />

      <List>
        <ListItem key={'Home'} disablePadding sx={{ display: 'block' }}>
          <Link href="/admin">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Drawer>
  );
}
