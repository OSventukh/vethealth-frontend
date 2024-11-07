import EditUserPassword from '../../../components/EditPassword';
import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ChangePasswordPage(props: Props) {
  const params = await props.params;

  const { id } = params;

  const session = await auth();
  const user = await api.users.getOne({ id, token: session?.token });

  return (
    <div className="mt-5 flex w-full flex-col gap-5 rounded-2xl border bg-background p-10">
      {!user && <div>Користувача не знайдено</div>}
      {user && <EditUserPassword user={user} />}
    </div>
  );
}
