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
    id: 'image',
    label: 'Image',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'description',
    label: 'Description',
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
    id: 'slug',
    label: 'Slug',
    numeric: false,
  },
];

export default function TopicsPage() {
  return <ItemsTable url="topics" title="Topics" header={header} query='include=parent' />;
}
