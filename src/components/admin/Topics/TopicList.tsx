import dynamic from 'next/dynamic';
import Loading from '@/components/admin/UI/Loading';
import useTable from '@/hooks/table-hook';
import Paper from '@mui/material/Paper';
import type { Topic } from '@/types/content-types';
import type { Data } from '@/types/ui-types';

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
  } = useTable<{topics: Topic[]}>({
    header,
    url: 'topics',
    query: '&parentId=null&include=children',
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
      data={data?.topics as Data[]}
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
