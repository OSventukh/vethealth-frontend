import { api } from '@/api';
import EditUser from '../components/EditUser';

export default async function CreateUserPage() {
  const topics = await api.topics.getMany({});
  return <EditUser topics={topics.items} />;
}
