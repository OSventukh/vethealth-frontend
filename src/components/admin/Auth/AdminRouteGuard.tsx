import { useEffect, useContext, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import type { ChildrenProps } from '@/types/props-types';
import AuthContext from '@/context/auth-context';
import Auth from './index';

export default function AdminRouteGuard(props: ChildrenProps) {
  const { isAuth, isLoading } = useContext(AuthContext);

  return (
    <>
      {!isAuth && isLoading && <CircularProgress />}
      {!isAuth && !isLoading && <Auth />}
      {isAuth && props.children}
    </>
  );
}
