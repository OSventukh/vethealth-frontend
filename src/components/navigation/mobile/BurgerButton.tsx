import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { MouseEventHandler } from 'react';

type BurgerButton = {
  onClick: MouseEventHandler<HTMLButtonElement> | undefined
}
export default function BurgerButton({ onClick }: BurgerButton) {
  return (
    <IconButton size="large" onClick={onClick}>
      <MenuIcon sx={{ color: 'var(--font-color)' }} />
    </IconButton>
  );
}
