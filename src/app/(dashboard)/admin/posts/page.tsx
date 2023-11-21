import { DataTable } from './data-table';
import { postColumns } from './columns';
import { api } from '@/api';

export default async function Posts() {
  const posts = await api.posts.getMany();
  console.log(posts);
  return <DataTable columns={postColumns} data={posts.items} />;
}
