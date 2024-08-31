import { Raleway } from 'next/font/google';
import { api } from '@/api';
import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';

type Props = {
  slug: string;
};
const raleway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default async function Post({ slug }: Props) {
  const post = await api.posts.getOne({
    slug,
    tags: ['posts'],
  });

  if (!post || typeof post === 'string') {
    return <div>Сторінка не знайдена</div>;
  }

  return (
    <div className="mt-8 rounded-xl border-[1px] border-border bg-white p-8">
      <h2
        className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
      >
        {post.title}
      </h2>
      <div>
        {post?.content && <ParsedContent content={JSON.parse(post.content)} />}
      </div>
    </div>
  );
}
