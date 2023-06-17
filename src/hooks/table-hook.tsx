import { useState, useCallback, useEffect } from 'react';
import { useGetData, usePostData } from './data-hook';

interface UseTable {
  url: string;
  header: {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
  }[];
  query?: string;
  transformCallback?: <T>(data: any) => T;
}

export default function useTable({ url, header, query, transformCallback }: UseTable) {
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

  const {
    data,
    isLoading,
    error: responseError,
    mutate,
    isValidating,
  } = useGetData(
    url && {
      key: `#${url}`,
      path: requestPath,
    }
  );

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
        setPage((prevState) =>
          prevState !== maxPage ? maxPage + 1 : prevState
        );
      }
    }
  }, [data, isLoading, page, size, isValidating]);

  useEffect(() => {
    if (responseError) {
      setErrorMessage('Receiving data failed');
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

  return {
    data: transformCallback && data ? transformCallback(data) : data,
    isLoading,
    itemsDeleteHandler,
    onSizeHandler,
    onSortHandler,
    setPage,
    sort,
    sortBy,
    page,
    size,
  };
}
