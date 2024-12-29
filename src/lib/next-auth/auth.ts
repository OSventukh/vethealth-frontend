import { getServerSession } from 'next-auth';
import { authOptions } from './next-auth';

export async function auth() {
  return await getServerSession(authOptions);
}
