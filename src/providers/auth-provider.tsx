import {
  useMemo,
  useCallback,
  useEffect
} from 'react';
import AuthContext from '@/context/auth-context';
import type { ChildrenProps } from '@/types/props-types';
import type { UserData, Auth, Token } from '@/types/auth-types';
import { useGetData, usePostData } from '@/hooks/data-hook';

export default function AuthContextProvider(props: ChildrenProps) {
  const { data, isLoading, error, mutate } = useGetData('login/refreshtoken', { revalidation: false, shouldRetryOnError: false, refreshInterval: 5 * 60 * 1000 });
  const { trigger } = usePostData('logout')

  const login = useCallback(() => {
    mutate();
  }, [mutate]);

  const logout = useCallback(async () => {
    await trigger({token: data.accessToken.token, method: 'POST'})
    mutate(null)
  }, [trigger, mutate, data]);

  useEffect(() => {
    if (data && data.accessToken.expirationDate) {
      const expirationTime = new Date(data.accessToken.expirationDate).getTime();
      const currentTime = Date.now();
      const timeout = expirationTime - currentTime;
      const timerId = setTimeout(() => {
        mutate();
      }, timeout);
      return () => clearTimeout(timerId);
    }
  }, [data, mutate]);

  const store = useMemo<Auth>(
    () => ({
      accessToken: data && data.accessToken.token,
      isAuth: data && !!data.accessToken.token,
      isLoading: isLoading,
      user: data && data.user,
      login,
      logout,
    }),
    [ data, login, logout, isLoading]
  );
  return (
    <AuthContext.Provider value={store}>{props.children}</AuthContext.Provider>
  );
}