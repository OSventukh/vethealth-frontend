import Link from 'next/link';
import { Raleway } from 'next/font/google';
import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';
import type { PostResponse } from '@/api/types/posts.type';
import { MoveRight } from 'lucide-react';

type Props = {
  post: PostResponse;
  topic: string;
};
const raleway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function PostItem({ post, topic }: Props) {
  return (
    <article className="rounded-xl border-[1px] border-border bg-white">
      <Link href={`${topic}/${post.slug}`} className="block h-full w-full p-8">
        <header>
          <h3
            className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
          >
            {post.title}
          </h3>
        </header>
        <ParsedContent content={JSON.parse(post.content)} excerpt />
        <footer className="flex justify-end">
          <MoveRight size={24} />
        </footer>
      </Link>
    </article>
  );
}
