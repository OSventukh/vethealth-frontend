import { useState, useCallback, useContext } from 'react';
import AuthContext from '@/context/auth-context';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import EnhancedTable from '@/components/admin/UI/Table';
import { SnackError, SnackSuccess } from '@/components/admin/UI/SnackBar';
import { useGetData, usePostData } from '@/hooks/data-hook';

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
];

export default function TopicsPage() {
  const [sortBy, setSortBy] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { accessToken } = useContext(AuthContext);
  const { data, isLoading, mutate } = useGetData(
    `topics?order=${sortBy}:${sort}&page=${page}&size=${size}`
  );
  const { trigger } = usePostData('topics');
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

  const itemsDeleteHandler = useCallback(
    async (items: readonly number[]) => {
      try {
        await trigger({
          token: accessToken,
          data: {
            id: items,
          },
          method: 'DELETE',
        });
        setSuccessMessage('Topic was successfully deleted');
        mutate();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Something went wrong'
        );
      }
    },
    [accessToken, trigger, mutate]
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
