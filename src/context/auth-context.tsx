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
  const loginTimeout = useRef<ReturnType<typeof setTimeout>>();

  const login = useCallback((token: Token, user: UserData) => {
    setAccessToken(token.token);
    setAccessTokenExpiresIn(token.expiresIn);
    setUserData(user);
    localStorage.setItem('token', JSON.stringify(token));
    const tokenExipirationDate = new Date(token.expiresIn);
    const timeUntilExpiration =
      tokenExipirationDate.getTime() - new Date().getTime();

    loginTimeout.current = setTimeout(() => {
      setAccessToken(null);
      setUserData(null);
      setAccessTokenExpiresIn(null);
    }, timeUntilExpiration);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAccessToken(null);
    setUserData(null);
    if (loginTimeout.current) clearTimeout(loginTimeout.current);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (accessTokenExpiresIn && accessTokenExpiresIn < new Date()) {
      const fetching = async() => {
        try {
          const response = await fetchData('/refreshTokens', {
            method: 'GET'
          })
          if (response) {
            setAccessToken(response.token);
            setAccessTokenExpiresIn(response.expiresIn);
          }
        } catch (error) {
          logout();
        }
      }
      fetching();
    }
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
