import NextAuth from 'next-auth';

import { authOptions } from '@/lib/next-auth/next-auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };