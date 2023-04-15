import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import EnhancedTable from '@/components/admin/UI/Table';

import { useData } from '@/hooks/data-hook';
export default function TopicsPage() {
  const [sortBy, setSortBy] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  const { data, isLoading, error } = useData(
    `topics?order=${sortBy}:${sort}&page=${page}&size=${size}`
  );
  const onSortHandler = useCallback((sortBy: string) => {
    setSortBy(sortBy);
    setSort((sort) => {
      if (sort === 'asc') return 'desc';
      return 'asc';
    });
  }, []);

  const onPageHandler = useCallback((page: number) => {
    setPage(page);
  }, []);

  const onSizeHandler = useCallback((size: number) => {
    setSize(size);
  }, []);

  const itemsDeleteHandler = (items: readonly number[]) => {
    console.log(items);
  }

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
  ]
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      {isLoading && !data && <CircularProgress />}
      {data && (
        <EnhancedTable
          header={header}
          title="Topics"
          data={data.topics}
          count={data.count}
          onSort={onSortHandler}
          order={sort}
          orderBy={sortBy}
          onPage={onPageHandler}
          page={page}
          onSize={onSizeHandler}
          size={size}
          onItemsDelete={itemsDeleteHandler}
        />
      )}
    </Box>
  );
}
