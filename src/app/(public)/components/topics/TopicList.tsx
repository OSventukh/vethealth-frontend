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
}
export default function TopicList({ items, parentSlug }: Props) {
  return (
    <div className="grid justify-center justify-items-center grid-cols-1 md:grid-cols-2 gap-8">
      {items.map((item) => (
        <div key={item.id}>
          <Link href={parentSlug ? `${parentSlug}/${item.slug}` : item.slug} key={item.slug}>
            <Image
              src={item.image.path}
              alt={item.title}
              width={200}
              height={200}
              className="w-[240px] h-[240px] rounded-2xl transition ease-in duration-300 hover:scale-110"
            />
          </Link>
          <div className="mt-4">
            <Link href={parentSlug ? `${parentSlug}/${item.slug}` : item.slug} key={item.slug}>
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
