import { TopicResponse } from '@/api/types/topics.type';
import { Pagination } from '@/api/types/general.type';
import { notFound } from 'next/navigation';
import TopicItem from './TopicItem';

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
        <TopicItem key={item.id} item={item} parentSlug={parentSlug} />
      ))}
    </div>
  );
}
