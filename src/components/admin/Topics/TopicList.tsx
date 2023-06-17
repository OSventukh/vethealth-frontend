// next imports 
import dynamic from 'next/dynamic';
// ui imports 
import Loading from '@/components/admin/UI/Loading';
// hook imports 
import useTable from '@/hooks/table-hook';
// mui imports
import Paper from '@mui/material/Paper';
// dynamic imports
const Table = dynamic(() => import('../UI/Table'), {
  loading: () => <Loading />,
  ssr: false,
});

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

export default function TopicList() {
  const {
    data,
    isLoading,
    page,
    setPage,
    size,
    sort,
    sortBy,
    itemsDeleteHandler,
    onSizeHandler,
    onSortHandler,
  } = useTable({
    header,
    url: 'topics',
    query: 'include=parent',
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
      title="Topics"
      data={data.topics}
      count={data.count}
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
