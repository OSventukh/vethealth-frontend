import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';
import EditPage from '../../components';

type Props = { params: Promise<{ slug: string }> };

export default async function EditPagePage(props: Props) {
  const params = await props.params;
  const session = await auth();

  const { slug } = params;
  const page = await api.pages.getOne({
    slug,
    token: session?.token,
    tags: ['admin_pages'],
  });
  return <EditPage initialData={page || null} editMode />;
}
