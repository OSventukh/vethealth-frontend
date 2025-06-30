import { TopicResponse } from '@/api/types/topics.type';
import TopicList from './TopicList';

type Props = {
  topic: TopicResponse;
  params: {
    topic: string;
    slug?: string[];
  };
};

export default function TopicChildrenList({ topic, params }: Props) {
  const parentSlug = params.slug
    ? `${params.topic}/${params.slug.join('/')}`
    : params.topic;

  return (
    <TopicList
      items={Promise.resolve(topic.children || [])}
      parentSlug={parentSlug}
    />
  );
}
