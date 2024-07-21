import { api } from '@/api';
import PostItem from '../PostItem';

type Props = {
  topic: string;
  category?: string;
};
export default async function PostList({ topic, category }: Props) {
  const posts = await api.posts.getMany({
    query: { topic, category },
    tags: ['posts'],
  });
  return (
    <div className="grid  gap-8 md:grid-cols-2">
      {posts?.items.map((post) => (
        <PostItem key={post.id} post={post} topic={topic} />
      ))}
    </div>
  );
}
