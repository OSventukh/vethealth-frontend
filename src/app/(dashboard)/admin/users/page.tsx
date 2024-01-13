import { DataTable } from '@/components/ui/DataTable';
import { userColumns } from './columns';
import { api } from '@/api';
import { userQuerySchema } from '@/utils/validators/query.validator';
import Link from 'next/link';
import { PenSquare } from 'lucide-react';
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
      <div className="w-full flex mb-5">
        <Link
          href="users/create"
          className="flex justify-center items-center p-5 py-3 bg-primary text-white hover:opacity-90 rounded-2xl shadow-lg"
        >
          <PenSquare /> Новий користувач
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
