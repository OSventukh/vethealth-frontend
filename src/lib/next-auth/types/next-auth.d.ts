import type { LoginResponse } from '@/api/types/auth.type';
import type { User, UserSession } from '@/utils/types/user.type';

declare module 'next-auth' {
  interface Session {
    user: UserSession;
    token: string;
    refreshToken: string;
    tokenExpires: number;
  }
  interface User extends LoginResponse {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    token: string;
    refreshToken: string;
    tokenExpires: number;
    user: User;
  }
}
