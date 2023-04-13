import {
  createContext,
  useMemo,
  useCallback,
  useEffect
} from 'react';
import { useRouter } from 'next/router';
import { fetchData } from '@/utils/fetch';
import type { ChildrenProps } from '@/types/props-types';
import type { UserData, Auth, Token } from '@/types/auth-types';
import { useData } from '@/hooks/data-hook';

const AuthContext = createContext<Auth>({
  accessToken: '',
  isAuth: false,
  isLoading: false,
  user: {
    id: null,
    firstname: null,
    lastname: null,
    email: null,
    createdAt: null,
    role: null,
  },
  login: () => {},
  logout: () => {},
});

export function AuthContextProvider(props: ChildrenProps) {
  const { data, isLoading, error, mutate } = useData('login/refreshtoken', { credentials: 'include'}, false);

  const login = useCallback((data: { user: UserData, accessToken: Token }) => {
    mutate({...data})
  }, [mutate]);

  const logout = useCallback(async () => {
    await fetchData('logout', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + data.accessToken.token,
      },
      credentials: 'include',
      
    })
    mutate(null)
  }, [data?.accessToken?.token, mutate]);


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

export default AuthContext;
