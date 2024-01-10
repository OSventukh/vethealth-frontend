import { api } from '@/api';
import EditTopic from '../components/EditTopic';

export default async function CreateTopicPage() {
  const categories = await api.categories.getMany({});
  const topics = await api.topics.getMany({});
  return <EditTopic categories={categories.items} parent={topics.items} />;
}
