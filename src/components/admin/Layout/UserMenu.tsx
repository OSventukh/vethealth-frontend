import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import AuthContext from '@/context/auth-context';
import { signOut, useSession } from "next-auth/react"


export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data } = useSession();
  const router = useRouter();
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
        
        <MenuItem onClick={clickMenuCloseHandler}><Typography variant='h6'>{data?.user.firstname} {data?.user?.lastname}</Typography></MenuItem>
        <MenuItem onClick={() => {signOut({ redirect: false}); router.push(`/auth/signin?callbackUrl=${router.pathname}`)}}>Exit</MenuItem>
      </Menu>
    </div>
  );
}
