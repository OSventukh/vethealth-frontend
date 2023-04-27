import dynamic from 'next/dynamic';
import CircularProgress from '@mui/material/CircularProgress';
const ItemsTable = dynamic(
  () => import('@/components/admin/Items/AllItemsTable'),
  {
    loading: () => <CircularProgress />,
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
  return <ItemsTable url="topics" title="Topics" header={header} />;
}
