import { KeyboardEventHandler, MouseEventHandler } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { MobileNavItem } from '@/components/navigation/mobile/MobileNavItem';
import { MobileNavExpandableItem } from '@/components/navigation/mobile/MobileNavExpandableItem';
import { Category } from '@/types/content-types';

type SideMenu = {
  data: Category[];
  open: boolean;
  onClose:
    | MouseEventHandler<HTMLDivElement>
    | KeyboardEventHandler<HTMLDivElement>
    | undefined;
  anchor: string;
};

export default function SideMenu({ data, open, onClose, anchor }: SideMenu) {
  const list = () => (
    <Box
      component="div"
      sx={{ width: 250 }}
      role="presentation"
      onClick={onClose as MouseEventHandler}
      onKeyDown={onClose as KeyboardEventHandler}
    >
      <List>
        {data.map((item, index) => {
          if (item.children && item.children.length > 0) {
            return (
              <MobileNavExpandableItem
                key={item.id}
                text={item.name}
                submenu={item.children}
                anchor={`/${anchor}?category=`}
              />
            );
          } else {
            return (
              <MobileNavItem
                key={item.id}
                text={item.name}
                link={`/${anchor}?$category=${item.slug}`}
              />
            );
          }
        })}
      </List>
    </Box>
  );
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '.MuiDrawer-paper': { backgroundColor: '#1e1e1e', color: '#ececec' },
      }}
    >
      {list()}
    </Drawer>
  );
}
