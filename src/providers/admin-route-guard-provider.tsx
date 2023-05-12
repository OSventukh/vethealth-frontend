import { useEffect, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { ChildrenProps } from '@/types/props-types';
import AuthContext from '@/context/auth-context';
import Auth from '../components/admin/Auth';

export default function AdminRouteGuard(props: ChildrenProps) {
  const { isAuth, isLoading } = useContext(AuthContext);

  return (
    <>
      {!isAuth && !isLoading && <Auth />}
      {isAuth && !isLoading && props.children}
    </>
  );
}
