import { DataTable } from '@/components/ui/DataTable';
import { userColumns } from './columns';
import { api } from '@/api';
import { userQuerySchema } from '@/utils/validators/query.validator';
import { UserPlus } from 'lucide-react';
import { auth } from '@/lib/next-auth/auth';
import CreateButton from '@/components/ui/create-button';

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
    tags: ['users'],
  });
  return (
    <>
      <CreateButton
        link="users/create"
        icon={<UserPlus size={20} />}
        text="Новий користувач"
      />

      <DataTable
        columns={userColumns}
        data={users?.items || []}
        pageCount={users?.totalPages || 1}
        searchField="firstname"
      />
    </>
  );
}
