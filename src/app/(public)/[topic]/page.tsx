import { api } from '@/api';
import TopicContent from '../components/topics/TopicContent';

type Props = {
  params: {
    topic: string;
  };
  searchParams: {
    category?: string;
  };
};
export default async function TopicPage({ params, searchParams }: Props) {
  const topic = await api.topics.getOne({
    slug: params.topic,
    query: { include: 'children' },
    tags: ['topics'],
  });
  return (
    <TopicContent topic={topic!} params={params} searchParams={searchParams} />
  );
}
