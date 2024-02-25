import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';
import EditPage from '../../components';

type Props = { params: { slug: string } };

export default async function EditPagePage({ params }: Props) {
  const session = await auth();

  const { slug } = params;
  const page = await api.pages.getOne({
    slug,
    token: session?.token,
    tags: ['admin_pages'],
  });
  return <EditPage initialData={page || null} editMode />;
}
