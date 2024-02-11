import { api } from '@/api';
import TopicList from './components/topics/TopicList';
import Description from './components/Description';

export default async function Home() {
  const topics = await api.topics.getMany({});
  return (
    <>
      <Description />
      <TopicList items={topics?.items || []} />
    </>
  );
}
