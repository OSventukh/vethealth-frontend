import { useEffect, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { ChildrenProps } from '@/types/props-types';
import AuthContext from '@/context/auth-context';

export default function AdminRouteGuard(props: ChildrenProps) {
  const router = useRouter();
  const { isAuth } = useContext(AuthContext);

  const isAdminPanel = useMemo(() => router.pathname.startsWith('/admin'), [router.pathname]);
  const authPage = useMemo(() => router.pathname.startsWith('/admin/auth'), [router.pathname]);

  useEffect(() => {
    if (isAdminPanel && !authPage && !isAuth) {
      router.push('/admin/auth')
    }
    if (authPage && isAuth) {
      router.push('/admin');
    }
  }, [authPage, isAdminPanel, router, isAuth])


  return <>{props.children}</>;
  
}
