import { api } from '@/api';
import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await api.posts.getOne(params.slug);
  return (
    <div>
      <h2>{post.title}</h2>
      <div>
        <ParsedContent content={JSON.parse(post.content)} />
      </div>
    </div>
  );
}
