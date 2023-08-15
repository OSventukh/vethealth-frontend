import Link from 'next/link';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

type MobileNavItem = {
  text: string;
  link: string;
  nested?: boolean;
}
export function MobileNavItem({ text, link, nested }: MobileNavItem) {
  return (
    <ListItem sx={{ p: 0, '& .MuiCollapse-root': { width: '100%' } }}>
      <ListItemButton
        sx={{ pl: nested ? 4 : 2 }}
        LinkComponent={Link}
        href={link}
      >
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
