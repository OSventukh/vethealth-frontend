import Link from 'next/link';
import Image from 'next/image';
import { Raleway } from 'next/font/google';
import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';
import type { PostResponse } from '@/api/types/posts.type';

type Props = {
  post: PostResponse;
  topic: string;
};
const raleway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function PostItem({ post, topic }: Props) {
  return (
    <article className="w-full overflow-hidden rounded-xl border-[1px] border-border bg-white pb-4 transition-shadow hover:shadow-md">
      <Link href={`${topic}/${post.slug}`} className="block h-full w-full">
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={500}
            height={500}
            className="h-80 w-full object-cover"
          />
        )}
        <header>
          <h3
            className={`${raleway.className} my-2 px-4 text-center text-lg font-[600] uppercase md:my-4`}
          >
            {post.title}
          </h3>
        </header>
        {post?.content && (
          <div className="px-4 py-0 md:px-8">
            <ParsedContent content={JSON.parse(post.content)} excerpt />
          </div>
        )}
        {/* <footer className="flex justify-end p-8">
          <MoveRight size={24} />
        </footer> */}
      </Link>
    </article>
  );
}
