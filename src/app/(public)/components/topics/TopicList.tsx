import Image from 'next/image';
import Link from 'next/link';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
});

import { TopicResponse } from '@/api/types/topics.type';

type Props = {
  items: TopicResponse[];
  parentSlug?: string;
};
export default function TopicList({ items, parentSlug }: Props) {
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
              className="h-[240px] w-[240px] rounded-2xl transition duration-300 ease-in hover:scale-110"
            />
          </Link>
          <div className="mt-4">
            <Link
              href={parentSlug ? `${parentSlug}/${item.slug}` : item.slug}
              key={item.slug}
            >
              <h3
                className={`${roboto.className} text-center text-sm uppercase`}
              >
                {item.title}
              </h3>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
