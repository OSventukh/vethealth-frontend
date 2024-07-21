import { api } from '@/api';
import EditPost from '../components/EditPost';
import { auth } from '@/lib/next-auth/auth';

export default async function CreatPage() {
  const session = await auth();
  const topics = await api.topics.getMany({});
  const categories = await api.categories.getMany({});
  return (
    <EditPost
      topics={topics?.items || []}
      categories={categories?.items || []}
      user={session?.user}
    />
  );
}
