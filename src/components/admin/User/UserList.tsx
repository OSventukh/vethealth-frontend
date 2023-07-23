import dynamic from 'next/dynamic';
import Loading from '@/components/admin/UI/Loading';
import useTable from '@/hooks/table-hook';
import { Paper } from '@mui/material';
import type { User } from '@/types/auth-types';
import type { Data } from '@/types/ui-types';

const Table = dynamic(() => import('@/components/admin/UI/Table'), {
  loading: () => <Loading />,
  ssr: false,
});


const header = [
  {
    disablePadding: false,
    id: 'firstname',
    label: 'First Name',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'lastname',
    label: 'Last Name',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'email',
    label: 'Email',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'status',
    label: 'Status',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'role',
    label: 'Role',
    numeric: false,
  },
];

// Tranform data that the user's role name is on the first level of the user object
const transformUsers = (data: any) => ({
  ...data,
  users: data?.users.map((user: any) => ({
    ...user,
    role: user?.role?.name,
  })),
});

export default function UserList() {
  const {
    data,
    isLoading,
    page,
    size,
    sort,
    sortBy,
    setPage,
    itemsDeleteHandler,
    onSortHandler,
    onSizeHandler,
  } = useTable<{ users: User[]}>({
    url: 'users',
    header,
    query: 'include=role',
    transformCallback: transformUsers
  });

  if (!data && !isLoading) {
    return (
      <Paper sx={{ width: '100%', p: '1rem', textAlign: 'center' }}>
        No data
      </Paper>
    );
  }
  if (isLoading) {
    return (
      <Paper sx={{ width: '100%', p: '1rem', textAlign: 'center' }}>
        <Loading />
      </Paper>
    );
  }

  return (
    <Table
      title="Users"
      data={data?.users as unknown as Data[]}
      count={data?.count || 0}
      page={page}
      header={header}
      onItemsDelete={itemsDeleteHandler}
      onPage={setPage}
      onSize={onSizeHandler}
      onSort={onSortHandler}
      size={size}
      order={sort}
      orderBy={sortBy}
    />
  );
}
