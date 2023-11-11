import type { User } from '@/api/types/auth.type';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: UserResponse;
    token: string;
    refreshToken: string;
    tokenExpires: number;
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    token: string;
    refreshToken: string;
    tokenExpires: number;
    user: User;
  }
}
