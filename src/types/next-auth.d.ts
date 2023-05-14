import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

type UserData = {
  id: string;
  firstname: string;
  lastname?: string;
};

declare module 'next-auth/jwt' {
  interface JWT {
    accessTokenExpires: number;
    refreshToken: string;
    accessToken: string;
    user: UserDatas;
    error: string;
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserData;
    accessToken: string;
    error: string;
  }

  interface User extends NextAuthUser {
    accessToken: {
      token: string;
      expirationDate: number;
    };
    refreshToken: {
      token: string;
    };
    user: UserData;
  }
}
