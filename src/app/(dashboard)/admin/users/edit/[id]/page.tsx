import { api } from '@/api';
import EditUser from '../../components/EditUser';
import { auth } from '@/lib/next-auth/auth';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function EditUserPage(props: Props) {
  const [params, session] = await Promise.all([props.params, auth()]);

  const { id } = params;

  const [user, topics] = await Promise.all([
    api.users.getOne({ id, token: session?.token }),
    api.topics.getMany({}),
  ]);

  return <EditUser topics={topics?.items || []} initialData={user} editMode />;
}
