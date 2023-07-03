import { useState } from 'react';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import type { NavItem, NavItemWithNested } from '@/types/props-types';

export function MobileNavItem({ text, link, nested, anchor }: NavItem) {
  return (
    <>
      <ListItem sx={{ p: 0 }}>
        <ListItemButton sx={{ pl: nested ? 4 : 2 }} LinkComponent={Link} href={anchor ? anchor + link: link }>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    </>
  );
}

export function MobileNavItemWithNested({
  text,
  nested,
  anchor
}: NavItemWithNested) {
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen(!open);
  };

  return (
    <ListItem sx={{ display: 'flex', flexDirection: 'column', p: 0}}>
      <ListItemButton sx={{ width: '100%', pl: 2}} onClick={handleClick}>
        <ListItemText primary={text} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {nested.map((item) => (
            <MobileNavItem key={item.id} text={item.name} link={anchor ? anchor + item.slug : item.slug} nested />
          ))}
        </List>
      </Collapse>
    </ListItem>
  );
}
