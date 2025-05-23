import { api } from '@/api';
import EditUser from '../../components/EditUser';
import { auth } from '@/lib/next-auth/auth';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function EditUserPage(props: Props) {
  const params = await props.params;

  const { id } = params;

  const session = await auth();
  const user = await api.users.getOne({ id, token: session?.token });
  const topics = await api.topics.getMany({});
  return <EditUser topics={topics?.items || []} initialData={user} editMode />;
}
