import NextAuth, { User as NextAuthUser, Account, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
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
          const res = await fetch('http://localhost:5000/login', {
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
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = user.accessToken.token;
        token.refreshToken = user.refreshToken.token;
        token.accessTokenExpires = user.accessToken.expirationDate;
        token.user = user.user;
      }

      if (Date.now() > token.accessTokenExpires) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token, user }) {
      console.log('session user', user);
      try {
        if (!token) {
          return session;
        }
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.error = token.error;

        return session;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : 'Something went wrong'
        );
      }
    },
  },
});

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch('http://localhost:5000/login/refreshtoken', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.refreshToken}`,
      },
    });
    const json = await res.json();

    if (!res.ok) {
      throw new Error('Failed to refresh access token');
    }

    return {
      ...token,
      accessToken: json.accessToken,
      refreshToken: json.refreshToken,
      accessTokenExpires: Date.now() + json.expires_in * 1000,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
