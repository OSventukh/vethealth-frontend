import { api } from '@/api';
import PostItem from '../PostItem';
import { notFound } from 'next/navigation';
import NotFound from '@/components/public/NotFound/NotFound';

type Props = {
  topic: string;
  category?: string;
};
export default async function PostList({ topic, category }: Props) {
  const posts = await api.posts.getMany({
    query: { topic, category },
    tags: ['posts'],
  });

  if (!posts) return notFound();

  return (
    <>
      {posts?.count > 0 && (
        <div className="grid gap-8 md:grid-cols-2">
          {posts?.items.map((post) => (
            <PostItem key={post.id} post={post} topic={topic} />
          ))}
        </div>
      )}
      {posts?.count === 0 && <NotFound text="Інформація поки-що відсутня" />}
    </>
  );
}
