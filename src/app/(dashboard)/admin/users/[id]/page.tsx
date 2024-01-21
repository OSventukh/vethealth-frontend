/* eslint-disable react/no-unescaped-entities */
import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  const user = await api.users.getOne({ id: params.id, token: session?.token });
  return (
    <div className="flex flex-col gap-5 w-full rounded-2xl border p-10 mt-5 bg-background">
      <h2>Профіль</h2>
      <div className="grid grid-cols-2 gap-2">
        <div>Ім'я:</div>
        <div>{user.firstname}</div>
        <div>Прізвище:</div>
        <div>{user.lastname}</div>
        <div>Пошта:</div>
        <div>{user.email}</div>
      </div>
    </div>
  );
}
