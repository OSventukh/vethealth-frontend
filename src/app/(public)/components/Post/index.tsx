import { Raleway } from 'next/font/google';
import { api } from '@/api';
import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import { notFound } from 'next/navigation';

type Props = {
  parentTopicSlug: string;
  slug: string;
};
const raleway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default async function Post({ slug, parentTopicSlug }: Props) {
  const post = await api.posts.getOne({
    slug,
    tags: ['posts'],
  });

  const parentTopic = await api.topics.getOne({
    slug: parentTopicSlug,
    tags: ['topics'],
  });

  if (!post || typeof post === 'string') {
    return notFound();
  }

  return (
    <>
      <CustomBreadcrumb
        prevPages={[
          { href: '/', label: 'Головна' },
          {
            href: '/' + parentTopic?.slug || '',
            label: parentTopic?.description || parentTopic?.title || '',
          },
        ]}
        currentPage={{ label: post?.title || '' }}
      />
      <div className="mt-4 rounded-xl border-[1px] border-border bg-white p-4 md:p-8">
        <h2
          className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
        >
          {post.title}
        </h2>
        <div className="prose max-w-none">
          {post?.content && (
            <ParsedContent content={JSON.parse(post.content)} />
          )}
        </div>
      </div>
    </>
  );
}
