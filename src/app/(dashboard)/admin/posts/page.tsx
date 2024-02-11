import { DataTable } from '@/components/ui/DataTable';
import { postColumns } from './columns';
import { api } from '@/api';
import { postQuerySchema } from '@/utils/validators/query.validator';
import Link from 'next/link';
import { PenSquare } from 'lucide-react';

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
    tags: ['posts'],
  });

  return (
    <>
      <div className="w-full flex">
        <Link
          href="posts/create"
          className="flex gap-2 justify-center items-center p-3 py-2 bg-primary text-sm text-white hover:opacity-90 rounded-xl shadow-lg"
        >
          <PenSquare size={20} /> Нова стаття
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
