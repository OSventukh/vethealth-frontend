import NextAuth, { DefaultSession, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User as UserData } from './auth-types';

type JWTToken = {
  token: string;
  expirationDate: string;
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessTokenExpires: string;
    refreshToken: string;
    accessToken: string;
    user: UserData;
    error?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: UserData;
    accessToken: string;
    accessTokenExpires: string;
    error: string;
  } 

  interface User {
    accessToken: JWTToken;
    refreshToken: JWTToken;
    user: UserData;
  }
}
