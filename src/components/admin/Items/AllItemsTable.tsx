import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import EnhancedTable from '@/components/admin/UI/Table';
import { SnackError, SnackSuccess } from '@/components/admin/UI/SnackBar';
import { useGetData, usePostData } from '@/hooks/data-hook';
import type { ItemsTableProps } from '@/types/props-types';
import { getSession } from 'next-auth/react';

export default function ItemsTable({url, title, header, query}: ItemsTableProps) {
  const [sortBy, setSortBy] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const attributes = header.map((item) => item.id).join();
  let requestPath = `${url}?order=${sortBy}:${sort}&page=${page}&size=${size}&columns=${attributes}`;

  if (query) {
    requestPath += `&${query}`;
  }

  const { data, isLoading, error: responseError, mutate, isValidating } = useGetData(url && {
    key: `#${url}`,
    path: requestPath,
  });

  const { trigger } = usePostData(url);

  const onSortHandler = useCallback((sortBy: string) => {
    setSortBy(sortBy);
    setSort((sort) => {
      if (sort === 'asc') return 'desc';
      return 'asc';
    });
  }, []);

  const onSizeHandler = useCallback((size: number) => {
    setSize(size);
  }, []);

  useEffect(() => {
    if (data && !isLoading && !isValidating) {
      const maxPage = Math.ceil(data.count / size);
      if (page > maxPage) {
        setPage((prevState) => (prevState !== maxPage ? maxPage + 1 : prevState));
      }
    }
  }, [data, isLoading, page, size, isValidating]);

  useEffect(() => {
    if (responseError) {
      setErrorMessage('Receiving data failed')
    }
  }, [responseError]);

  const itemsDeleteHandler = useCallback(
    async (items: readonly number[]) => {
      try {
        const response = await trigger({
          data: {
            id: items,
          },
          method: 'DELETE',
        });
        setSuccessMessage(response?.message ?? 'Item was successfully deleted');
        mutate();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Something went wrong'
        );
      }
    },
    [trigger, mutate]
  );

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {errorMessage && (
        <SnackError
          open={true}
          onClose={() => setErrorMessage(null)}
          content={errorMessage}
        />
      )}
      {successMessage && (
        <SnackSuccess
          open={true}
          onClose={() => setSuccessMessage(null)}
          content={successMessage}
        />
      )}
      {isLoading && !data && <CircularProgress />}
      {data && data[url].length > 0 && (
        <EnhancedTable
          header={header}
          title={title}
          data={data[url]}
          count={data.count}
          onSort={onSortHandler}
          order={sort}
          orderBy={sortBy}
          onPage={setPage}
          page={page}
          onSize={onSizeHandler}
          size={size}
          onItemsDelete={itemsDeleteHandler}
        />
      )}
      {data && data[url].length === 0 && <Paper sx={{ width: '100%', p: '1rem', textAlign: 'center'}}>No data</Paper>}
    </Box>
  );
}
