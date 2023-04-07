import { Theme } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import { Drawer, DrawerHeader } from '@/theme/drawer';

interface NavigationProps {
  open: boolean;
  handleDrawerToggle: () => void;
  theme: Theme;
}

export default function Navigation({
  open,
  handleDrawerToggle,
  theme,
}: NavigationProps) {
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader />

      <List>
        <Link href="/admin">
          <ListItem key={'Home'} disablePadding sx={{ display: 'block' }}>
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
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
}
