import { auth } from '@/lib/next-auth/auth';

export default async function AdminPage() {
  const session = await auth();
  return <div>AdminPage</div>;
}
