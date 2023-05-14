import { useEffect, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { ChildrenProps } from '@/types/props-types';
import AuthContext from '@/context/auth-context';
import Auth from '../components/admin/Auth';
import { useSession } from "next-auth/react";

export default function AdminRouteGuard(props: ChildrenProps) {
  const session = useSession();
  console.log(session)
  const { isAuth, isLoading } = useContext(AuthContext);

  return (
    <>
      {!isAuth && !isLoading && <Auth />}
      {isAuth && !isLoading && props.children}
    </>
  );
}
