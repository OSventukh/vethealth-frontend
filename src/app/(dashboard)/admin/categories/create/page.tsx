import EditCategory from '../components/EditCategory';
import { api } from '@/api';

export default async function CategoryCreatePage() {
  const categories = await api.categories.getMany({});
  return <EditCategory categories={categories.items} />;
}
