import { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { MobileNavItem } from './MobileNavItem';
import type { MobileNavExpandableItem } from '@/types/props-types';

export function MobileNavExpandableItem({
  text,
  submenu,
  anchor,
}: MobileNavExpandableItem) {
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen(!open);
  };

  return (
    <ListItem
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 0,
        '& .MuiCollapse-root': { width: '100%' },
      }}
    >
      <ListItemButton sx={{ width: '100%', pl: 2 }} onClick={handleClick}>
        <ListItemText primary={text} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {submenu.map((item) => (
            <MobileNavItem
              key={item.id}
              text={item.name}
              link={anchor ? anchor + item.slug : item.slug}
              nested
            />
          ))}
        </List>
      </Collapse>
    </ListItem>
  );
}
