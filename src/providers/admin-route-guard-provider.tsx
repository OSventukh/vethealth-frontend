import { useEffect, useContext, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import type { ChildrenProps } from '@/types/props-types';
import AuthContext from '@/context/auth-context';
import Auth from '../components/admin/Auth/index';
export default function AdminRouteGuard(props: ChildrenProps) {
  const { isAuth, isLoading } = useContext(AuthContext);

  return (
    <>
      {!isAuth && !isLoading && <Auth />}
      {isAuth && props.children}
    </>
  );
}
