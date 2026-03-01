import { api } from '@/api';
import EditTopic from '../components/EditTopic';

export default async function CreateTopicPage() {
  const [categories, topics, pages] = await Promise.all([
    api.categories.getMany({}),
    api.topics.getMany({}),
    api.pages.getMany({}),
  ]);

  return (
    <EditTopic
      categories={categories?.items || []}
      topics={topics?.items || []}
      pages={pages?.items || []}
    />
  );
}
