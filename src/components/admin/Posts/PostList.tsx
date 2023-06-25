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
  {
    disablePadding: false,
    id: 'author',
    label: 'Author',
    numeric: false,
  },
];

// Tranform data that the author's name is on the first level of the post object
const transformPosts = (data: any) => ({
  ...data,
  posts: data?.posts.map((post: any) => ({
    ...post,
    author: post?.author?.firstname,
  })),
});

export default function PostsList() {
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
    url: 'posts',
    header,
    query: 'include=author',
    transformCallback: transformPosts,
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
      header={header}
      title="Posts"
      data={data?.posts}
      count={data?.count}
      onSort={onSortHandler}
      order={sort}
      orderBy={sortBy}
      onPage={setPage}
      page={page}
      onSize={onSizeHandler}
      size={size}
      onItemsDelete={itemsDeleteHandler}
    />
  );
}
