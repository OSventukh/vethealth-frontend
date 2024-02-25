'use client';
import Link from 'next/link';
import {
  ArrowUpDown,
  ChevronDownCircleIcon,
  ChevronRightCircle,
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
import { IconButton } from '@/components/ui/icon-button';
import { deletePostAction } from './actions/delete-post.action';
import { toast } from '@/components/ui/use-toast';

export const postColumns: ColumnDef<PostResponse>[] = [
  {
    accessorKey: 'title',
    header: 'Заголовок',
    cell: ({ row }) => {
      const post = row.original as PostResponse;

      return (
        <div
          className="flex items-center gap-1"
          style={{ paddingLeft: `${row.depth}rem` }}
        >
          <div className="flex w-10 items-center justify-center">
            {row.getCanExpand() && (
              <IconButton
                icon={
                  row.getIsExpanded() ? (
                    <ChevronDownCircleIcon size={15} />
                  ) : (
                    <ChevronRightCircle size={15} />
                  )
                }
                onClick={() => row.toggleExpanded()}
              ></IconButton>
            )}
          </div>
          <div>
            <Link href={'posts/edit/' + post.slug}>{post.title}</Link>
          </div>
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
    cell: ({ getValue }) => {
      const value = getValue() as string;
      if (value === 'Published') {
        return (
          <span className="w-full rounded-full bg-green-500 px-4 py-1 text-center text-white">
            Опубліковано
          </span>
        );
      }
      if (value === 'Draft') {
        return (
          <span className="w-full rounded-full bg-yellow-500 px-4 py-1 text-center text-white">
            Чернетка
          </span>
        );
      }

      if (value === 'OnReview') {
        return (
          <span className="w-full rounded-full bg-blue-500 px-4 py-1 text-center text-white">
            На рецензії
          </span>
        );
      }
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
              <div className="flex h-full w-full justify-end">
                <IconButton icon={<MoreHorizontal size={15} />}>
                  <span className="sr-only">Open menu</span>
                </IconButton>
              </div>
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
            <Button
                variant="destructive"
                onClick={async () => {
                  const res = await deletePostAction(post.id);
                  toast({
                    variant: res.error ? 'destructive' : 'success',
                    description: res.success
                      ? 'Стаття видалена'
                      : res.message,
                  });
                }}
              >
                Видалити
              </Button>
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
