import dynamic from 'next/dynamic';
import Loading from '@/components/admin/UI/Loading';

const ItemsTable = dynamic(
  () => import('@/components/admin/Items/AllItemsTable'),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

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

export default function UsersPage() {
  return <ItemsTable url="users" title="Users" header={header} query='include=role'/>;
}
