import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { NavIconProps } from '@/types/props-types';

export default function NavItem({
  open,
  link,
  icon,
  children,
  onClick,
  expandIcon,
  selected,
  nested,
}: NavIconProps) {
  return (
    <ListItem key={children} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        LinkComponent={Link}
        href={link}
        onClick={onClick}
        selected={selected}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          ...(nested && {
            '&.Mui-selected': {
              color: 'primary.dark',
              background: 'none',
            },
          }),
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary={children} sx={{ opacity: open ? 1 : 0 }} />
        {open && expandIcon}
      </ListItemButton>
    </ListItem>
  );
}
