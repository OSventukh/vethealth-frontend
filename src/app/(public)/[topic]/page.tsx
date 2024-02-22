import { api } from '@/api';
import Description from '../components/Description';
import PostList from '../components/Post/PostList';
import Page from '../components/Page';
import TopicList from '../components/topics/TopicList';
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
  console.log(searchParams);
  const topic = await api.topics.getOne({
    slug: params.topic,
    query: { include: 'children' },
    tags: ['topics'],
  });
  return (
    <TopicContent topic={topic!} params={params} searchParams={searchParams} />
  );
}
