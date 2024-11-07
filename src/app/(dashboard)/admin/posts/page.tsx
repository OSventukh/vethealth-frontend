import { DataTable } from '@/components/ui/DataTable';
import { postColumns } from './columns';
import { api } from '@/api';
import { postQuerySchema } from '@/utils/validators/query.validator';
import { PenSquare } from 'lucide-react';
import CreateButton from '@/components/ui/create-button';

type Props = {
  searchParams: Promise<{
    page?: string;
    size?: string;
    sort?: string;
    orderBy?: string;
    title?: string;
    status?: string;
  }>;
};

export default async function PostsPage(props: Props) {
  const searchParams = await props.searchParams;
  const postQueryValidation = postQuerySchema.safeParse(searchParams);
  const posts = await api.posts.getMany({
    query: {
      status: 'all',
      ...(postQueryValidation.success ? postQueryValidation.data : undefined),
    },
    tags: ['posts'],
  });

  return (
    <>
      <CreateButton
        link="posts/create"
        icon={<PenSquare size={20} />}
        text="Нова стаття"
      />

      <DataTable
        columns={postColumns}
        data={posts?.items || []}
        pageCount={posts?.totalPages || 0}
        searchField="title"
      />
    </>
  );
}
