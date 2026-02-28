import Link from 'next/link';
import { TopicResponse } from '@/api/types/topics.type';
import TopicImage from './TopicImage';
import { roboto } from '@/lib/fonts';

type Props = {
  item: TopicResponse;
  parentSlug?: string;
  imagePriority?: boolean;
};

export default function TopicItem({
  item,
  parentSlug,
  imagePriority = false,
}: Props) {
  return (
    <div>
      <Link href={parentSlug ? `${parentSlug}/${item.slug}` : item.slug}>
        <TopicImage
          src={item.image.path}
          alt={item.title}
          priority={imagePriority}
        />
      </Link>
      <div className="mt-4">
        <Link
          href={parentSlug ? `${parentSlug}/${item.slug}` : item.slug}
          key={item.slug}
        >
          <h2
            className={`${roboto.className} w-60 text-center text-sm uppercase`}
          >
            {item.title}
          </h2>
        </Link>
      </div>
    </div>
  );
}
