import { DataTable } from '@/components/ui/DataTable';
import { postColumns } from './columns';
import { api } from '@/api';
import { postQuerySchema } from '@/utils/validators/query.validator';

type Props = {
  searchParams: {
    page?: string;
    size?: string;
    sort?: string;
    orderBy?: string;
    title?: string;
  };
};

export default async function Posts({ searchParams }: Props) {
  const postQueryValidation = postQuerySchema.safeParse(searchParams);
  const posts = await api.posts.getMany({
    query: postQueryValidation.success ? postQueryValidation.data : undefined,
  });

  return (
    <DataTable
      columns={postColumns}
      data={posts.items}
      pageCount={posts.totalPages}
      searchField="title"
    />
  );
}
