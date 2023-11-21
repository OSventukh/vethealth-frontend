import { ColumnDef } from '@tanstack/react-table';
import type { PostResponse } from '@/api/types/posts.type';

export const postColumns: ColumnDef<PostResponse>[] = [
  {
    accessorKey: 'title',
    header: 'Заголовок',
  },
  {
    accessorKey: 'status',
    header: 'Статус',
  },
  {
    accessorKey: 'createdAt',
    header: 'Створено',
  },
  {
    accessorKey: 'slug',
    header: 'URL адреса',
  },
];
