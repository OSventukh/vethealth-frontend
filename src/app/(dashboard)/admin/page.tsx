import { auth } from '@/lib/next-auth/auth';
import Editor from '@/components/dashboard/Editor';
export default async function AdminPage() {
  const session = await auth();
  return <Editor />;
}
