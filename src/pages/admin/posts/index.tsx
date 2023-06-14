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
    id: 'title',
    label: 'Title',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'slug',
    label: 'Slug',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'createdAt',
    label: 'Created',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'updatedAt',
    label: 'Updated',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'atuhor.name',
    label: 'Author',
    numeric: false,
  },
];

export default function PostsPage() {
  return <ItemsTable url="posts" title="Posts" header={header} query='include=author'/>;
}
