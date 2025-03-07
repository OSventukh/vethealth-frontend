import { auth } from '@/lib/next-auth/auth';
import EditCategory from '../../components/EditCategory';
import { api } from '@/api';

type Props = {
  params: Promise<{ slug: string }>;
};
export default async function CategoryCreatePage(props: Props) {
  const params = await props.params;
  const categories = await api.categories.getMany({});
  const session = await auth();
  const { slug } = params;
  const category = await api.categories.getOne({
    slug,
    token: session?.token,
    query: { include: 'parent,children' },
  });

  return (
    <EditCategory
      initialData={category || null}
      categories={categories?.items || []}
      editMode
    />
  );
}
