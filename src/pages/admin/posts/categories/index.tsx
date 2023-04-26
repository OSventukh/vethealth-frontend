
import ItemsTable from '@/components/admin/Items/AllItemsTable';

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
  // {
  //   disablePadding: false,
  //   id: 'parent',
  //   label: 'Parent',
  //   numeric: false,
  // },
];

export default function CategoriesPage() {
  return <ItemsTable url="categories" title="Categories" header={header} query='include=parent' />
}