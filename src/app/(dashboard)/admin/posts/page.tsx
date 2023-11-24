import { DataTable } from '@/components/ui/DataTable';
import { postColumns } from './columns';
import { api } from '@/api';

export default async function Posts({
  searchParams,
}: {
  searchParams: { page: string; size: string; sort: string; orderBy: string };
}) {
  const { page, size, orderBy, sort } = searchParams;
  const posts = await api.posts.getMany(
    `?page=${page || 1}&size=${size || 10}&orderBy=${
      orderBy || 'createdAt'
    }&sort=${sort || 'asc'}`
  );

  return (
    <DataTable
      columns={postColumns}
      data={posts.items}
      pageCount={posts.totalPages}
    />
  );
}
