import { api } from '@/api';
import EditPost from '../components/EditPost';

export default async function CreateostPage() {
  const topics = await api.topics.getMany({});
  const categories = await api.categories.getMany({});
  return <EditPost topics={topics.items} categories={categories.items} />;
}
