import dynamic from 'next/dynamic';

import Loading from '@/components/admin/UI/Loading';
import useTable from '@/hooks/table-hook';

import { Paper } from '@mui/material';

const Table = dynamic(() => import('@/components/admin/UI/Table'), {
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
  }
];


export default function PageList() {
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
  } = useTable({
    url: 'pages',
    header,
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
      title="Pages"
      data={data.pages}
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
