import dynamic from 'next/dynamic';

import Loading from '@/components/admin/UI/Loading';
import useTable from '@/hooks/table-hook';

import { Paper } from '@mui/material';
import type { Page } from '@/types/content-types';
import type { Data } from '@/types/ui-types';

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
  } = useTable<{pages: Page[]}>({
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
      data={data?.pages as Data[]}
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
