import { useState, useContext } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import AuthContext from '@/context/auth-context';


export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useContext(AuthContext);
  const clickMenuHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const clickMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={clickMenuHandler}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={clickMenuCloseHandler}
      >
        <MenuItem onClick={clickMenuCloseHandler}>Profile</MenuItem>
        <MenuItem onClick={logout}>Exit</MenuItem>
      </Menu>
    </div>
  );
}
