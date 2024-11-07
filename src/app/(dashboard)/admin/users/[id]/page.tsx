/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';

export default async function UserProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  const user = await api.users.getOne({ id: params.id, token: session?.token });
  return (
    <>
      <div className="flex w-full justify-start">
        <Link
          href={`edit/${params.id}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary p-3 py-2 text-sm text-white shadow-lg hover:opacity-90"
        >
          Редагувати профіль
        </Link>
      </div>
      <div className="mt-5 flex w-full flex-col gap-5 rounded-2xl border bg-background p-10">
        <h2>Профіль</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Ім'я:</div>
          <div>{user?.firstname}</div>
          <div>Прізвище:</div>
          <div>{user?.lastname}</div>
          <div>Пошта:</div>
          <div>{user?.email}</div>
        </div>
      </div>
    </>
  );
}
