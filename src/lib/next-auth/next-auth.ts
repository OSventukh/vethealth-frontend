/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { api } from '@/api';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.password) {
          return null;
        }

        try {
          const user = await api.auth.login({
            email: credentials.email,
            password: credentials.password,
          });
          return user as any;
        } catch (error) {
          throw new Error();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      if (new Date().getTime() < token.tokenExpires) return token;

      const newTokens = await api.auth.refresh(token.refreshToken);
      return {
        user: token.user,
        ...newTokens,
      };
    },

    async session({ token, session }) {
      session.user = token.user;
      session.token = token.token;

      return session;
    },
  },
};
