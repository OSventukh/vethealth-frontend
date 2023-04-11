import {
  useEffect,
  useState,
  createContext,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { fetchData } from '@/utils/fetch';
import type { ChildrenProps } from '@/types/props-types';
import type { UserData, Auth, Token } from '@/types/auth-types';

const AuthContext = createContext<Auth>({
  accessToken: '',
  isAuth: false,
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenExpiresIn, setAccessTokenExpiresIn] = useState<Date | null>(
    null
  );
  const [userData, setUserData] = useState<UserData | null>(null);
  const login = useCallback((token: Token, user: UserData) => {
    setAccessToken(token.token);
    setAccessTokenExpiresIn(token.expirationDate);
    setUserData(user);
    localStorage.setItem('token', JSON.stringify(token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAccessToken(null);
    setUserData(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const parsedToken = JSON.parse(token);
      setAccessToken(parsedToken.token);
      setAccessTokenExpiresIn(parsedToken.expiresIn);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (accessTokenExpiresIn && accessTokenExpiresIn <= new Date()) {
      const fetching = async() => {
        try {
          const response = await fetchData('login/refreshtoken', {
            method: 'GET',
            credentials: 'include',
            signal
          });
          if (response) {
            setAccessToken(response.token);
            setAccessTokenExpiresIn(response.expiresIn);
            localStorage.setItem('token', JSON.stringify(response.token));
          }
        } catch (error) {
          logout();
        }
      }
      fetching();
    }
    () => controller.abort()
  }, [accessTokenExpiresIn, logout]);

  const store = useMemo<Auth>(
    () => ({
      accessToken,
      isAuth: !!accessToken,
      user: userData,
      login,
      logout,
    }),
    [accessToken, userData, login, logout]
  );
  return (
    <AuthContext.Provider value={store}>{props.children}</AuthContext.Provider>
  );
}

export default AuthContext;
