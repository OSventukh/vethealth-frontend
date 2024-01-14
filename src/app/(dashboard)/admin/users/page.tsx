import { DataTable } from '@/components/ui/DataTable';
import { userColumns } from './columns';
import { api } from '@/api';
import { userQuerySchema } from '@/utils/validators/query.validator';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { auth } from '@/lib/next-auth/auth';

type Props = {
  searchParams: {
    page?: string;
    size?: string;
    sort?: string;
    orderBy?: string;
    title?: string;
  };
};

export default async function UsersPage({ searchParams }: Props) {
  const userQueryValidation = userQuerySchema.safeParse(searchParams);
  const session = await auth();

  const users = await api.users.getMany({
    query: userQueryValidation.success ? userQueryValidation.data : undefined,
    token: session?.token,
    tags: ['admin_users'],
  });
  return (
    <>
      <div className="w-full flex">
        <Link
          href="users/create"
          className="flex gap-2 justify-center items-center p-3 py-2 bg-primary text-sm text-white hover:opacity-90 rounded-xl shadow-lg"
        >
          <UserPlus size={20} /> Новий користувач
        </Link>
      </div>
      <DataTable
        columns={userColumns}
        data={users.items}
        pageCount={users.totalPages}
        searchField="firstname"
      />
    </>
  );
}
