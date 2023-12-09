import { DataTable } from '@/components/ui/DataTable';
import { postColumns } from './columns';
import { api } from '@/api';
import { postQuerySchema } from '@/utils/validators/query.validator';
import Link from 'next/link';
import { PenSquare, Plus } from 'lucide-react';

type Props = {
  searchParams: {
    page?: string;
    size?: string;
    sort?: string;
    orderBy?: string;
    title?: string;
  };
};

export default async function PostsPage({ searchParams }: Props) {
  const postQueryValidation = postQuerySchema.safeParse(searchParams);
  const posts = await api.posts.getMany({
    query: postQueryValidation.success ? postQueryValidation.data : undefined,
    tags: ['admin_posts'],
  });

  return (
    <>
      <div className="w-full flex mb-5">
        <Link
          href="posts/create"
          className="flex justify-center items-center p-5 py-3 bg-primary text-white hover:opacity-90 rounded-2xl shadow-lg"
        >
          <PenSquare /> Нова стаття
        </Link>
      </div>
      <DataTable
        columns={postColumns}
        data={posts.items}
        pageCount={posts.totalPages}
        searchField="title"
      />
    </>
  );
}
