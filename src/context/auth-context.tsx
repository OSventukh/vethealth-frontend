import { createContext } from 'react';
import type { Auth } from '@/types/auth-types';

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

export default AuthContext;
