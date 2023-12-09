'use client';
import Link from 'next/link';
import {
  ArrowUpDown,
  Copy,
  FileEdit,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';

import type { PostResponse } from '@/api/types/posts.type';

export const postColumns: ColumnDef<PostResponse>[] = [
  {
    accessorKey: 'title',
    header: 'Заголовок',
    cell: ({ row }) => {
      const post = row.original as PostResponse;
      return (
        <div>
          <Link href={'posts/edit/' + post.slug}>{post.title}</Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Статус
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'slug',
    header: 'URL адреса',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Дата створення
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const date = new Date(value);
      return <>{date.toLocaleDateString('uk-UA')}</>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const post = row.original as PostResponse;
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="gap-2"
                onClick={() => navigator.clipboard.writeText(post.id)}
              >
                <Copy size={16} /> Копіювати адресу
              </DropdownMenuItem>
              <Link href={'posts/edit/' + post.slug}>
                <DropdownMenuItem className="gap-2">
                  <FileEdit size={16} />
                  Редагувати
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2 text-red-700 focus:text-red-700">
                  <Trash2 size={16} />
                  Видалити
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Видалити статтю</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Ви впевненні що хочете видалити статтю &quot;{post.title}&quot;?
            </DialogDescription>
            <DialogFooter>
              <Button variant="destructive">Видалити</Button>
              <DialogClose asChild>
                <Button>Скасувати</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
