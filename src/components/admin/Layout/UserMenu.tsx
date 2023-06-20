import { useState } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

import { signOut, useSession } from 'next-auth/react';

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const logoutHandler = () => {
    signOut({ redirect: false });
    router.push(`/auth/signin?callbackUrl=${router.pathname}`);
  };

  const clickMenuHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

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
        <MenuItem component={Link} href={`/admin/users/profile?user=${session?.user.id}`} onClick={clickMenuCloseHandler}>
          {session?.user.firstname} {session?.user?.lastname}
        </MenuItem>
        <MenuItem onClick={logoutHandler}>Exit</MenuItem>
      </Menu>
    </div>
  );
}
