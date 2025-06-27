import Image from 'next/image';
import Link from 'next/link';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
});

import { TopicResponse } from '@/api/types/topics.type';
import { Pagination } from '@/api/types/general.type';
import { notFound } from 'next/navigation';

type Props =
  | {
      topics: Promise<Pagination<TopicResponse> | null>;
      items?: never;
      parentSlug?: string;
    }
  | { items: Promise<TopicResponse[]>; topics?: never; parentSlug?: string };

export default async function TopicList({
  topics,
  items: topicsItems,
  parentSlug,
}: Props) {
  const items = topics ? (await topics)?.items : await topicsItems;

  if (!items || items.length === 0) {
    return notFound(); // Return not found if no items are available
  }
  return (
    <div className="grid grid-cols-1 justify-center justify-items-center gap-8 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.id}>
          <Link
            href={parentSlug ? `${parentSlug}/${item.slug}` : item.slug}
            key={item.slug}
          >
            <Image
              src={item.image.path}
              alt={item.title}
              width={200}
              height={200}
              className="h-[240px] w-[240px] rounded-2xl transition duration-300 ease-in md:hover:scale-110"
              priority
            />
          </Link>
          <div className="mt-4">
            <Link
              href={parentSlug ? `${parentSlug}/${item.slug}` : item.slug}
              key={item.slug}
            >
              <h2
                className={`${roboto.className} text-center text-sm uppercase`}
              >
                {item.title}
              </h2>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
