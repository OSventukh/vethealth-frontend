import Link from 'next/link';
import { Roboto } from 'next/font/google';
import { TopicResponse } from '@/api/types/topics.type';
import TopicImage from './TopicImage';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
});

type Props = {
  item: TopicResponse;
  parentSlug?: string;
};

export default function TopicItem({ item, parentSlug }: Props) {
  return (
    <div className="w-60">
      <Link href={parentSlug ? `${parentSlug}/${item.slug}` : item.slug}>
        <TopicImage src={item.image.path} alt={item.title} />
      </Link>
      <div className="mt-4">
        <Link
          href={parentSlug ? `${parentSlug}/${item.slug}` : item.slug}
          key={item.slug}
        >
          <h2 className={`${roboto.className} text-center text-sm uppercase`}>
            {item.title}
          </h2>
        </Link>
      </div>
    </div>
  );
}
