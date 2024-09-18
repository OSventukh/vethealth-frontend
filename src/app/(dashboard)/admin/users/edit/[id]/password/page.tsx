import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EditUserPassword from '../../../components/EditPassword';
import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';

type Props = {
  params: { id: string };
};

export default async function ChangePasswordPage({ params: { id } }: Props) {
  const session = await auth();
  const user = await api.users.getOne({ id, token: session?.token });

  return (
    <div className="mt-5 flex w-full flex-col gap-5 rounded-2xl border bg-background p-10">
      {!user && <div>Користувача не знайдено</div>}
      {user && <EditUserPassword user={user} />}
    </div>
  );
}