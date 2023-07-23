import NextAuth, { User as NextAuthUser, Account, Session, NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';


async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/login/refreshtoken`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.refreshToken}`,
        },
        cache: 'no-cache',
      }
    );
    const result = await res.json();

    if (!res.ok) {
      throw new Error('Failed to refresh access token');
    }

    return {
      ...token,
      accessToken: result.accessToken.token,
      refreshToken: result.refreshToken.token,
      accessTokenExpires: result.accessToken.expirationDate,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const nextAuthOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API}/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          });
          const user = await res.json();

          if (!res.ok) {
            throw new Error(user.message);
          }

          return user;
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : 'Something went wrong'
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, trigger, session }): Promise<JWT> {
      if (account && user) {
        return {
          accessToken: user.accessToken.token,
          refreshToken: user.refreshToken.token,
          accessTokenExpires: user.accessToken.expirationDate,
          user: user.user,
        };
      }
      if (trigger === 'update') {
        return {
          ...token,
          user: session.user,
        };
      }

      if (new Date().getTime() < new Date(token.accessTokenExpires).getTime()) {
        return token;
      }

      try {
        const newToken = await refreshAccessToken(token);
        return newToken;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : 'Something went wrong'
        );
      }
    },
    async session({ session, token, trigger, newSession }) {
      try {
        if (trigger === 'update' && newSession?.user) {
          return {
            ...session,
            user: newSession.user,
          };
        }
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
        if (token.error) {
          session.error = token.error;
        }

        return session;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : 'Something went wrong'
        );
      }
    },
  },
  jwt: {
    maxAge: 1 * 60,
  },
};

export default NextAuth(nextAuthOptions);
