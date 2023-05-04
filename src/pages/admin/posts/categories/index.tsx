
import dynamic from 'next/dynamic';
import Loading from '@/components/admin/UI/Loading';

const ItemsTable = dynamic(() => import('@/components/admin/Items/AllItemsTable'), {
  loading: () => <Loading />,
  ssr: false,
})

const header = [
  {
    disablePadding: false,
    id: 'name',
    label: 'Name',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'slug',
    label: 'Slug',
    numeric: false,
  },
];

export default function CategoriesPage() {
  return <ItemsTable url="categories" title="Categories" header={header} query='include=parent' />
}

