import { api } from '@/api';
import EditTopic from '../components/EditTopic';

export default async function CreateTopicPage() {
  const categories = await api.categories.getMany({});
  const topics = await api.topics.getMany({});
  const pages = await api.pages.getMany({});
  return (
    <EditTopic
      categories={categories?.items || []}
      topics={topics?.items || []}
      pages={pages?.items || []}
    />
  );
}
