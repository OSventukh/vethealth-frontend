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

import type { PageResponse } from '@/api/types/pages.type';
import { IconButton } from '@/components/ui/icon-button';
import { toast } from '@/components/ui/use-toast';
import { deletePageAction } from './actions/delete-page.action';

export const pageColumns: ColumnDef<PageResponse>[] = [
  {
    accessorKey: 'title',
    header: 'Заголовок',
    cell: ({ row }) => {
      const page = row.original as PageResponse;

      return (
        <div
          className="flex gap-1 items-center"
          style={{ paddingLeft: `${row.depth}rem` }}
        >
          <div className="flex justify-center items-center w-10">
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
            <Link href={'pages/edit/' + page.slug}>{page.title}</Link>
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
      const page = row.original as PageResponse;
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex w-full h-full justify-end">
                <IconButton icon={<MoreHorizontal size={15} />}>
                  <span className="sr-only">Open menu</span>
                </IconButton>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="gap-2"
                onClick={() => navigator.clipboard.writeText(page.id)}
              >
                <Copy size={16} /> Копіювати адресу
              </DropdownMenuItem>
              <Link href={'pages/edit/' + page.slug}>
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
              <DialogTitle>Видалити сторінку</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Ви впевненні що хочете видалити сторінку &quot;{page.title}&quot;?
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={async () => {
                  const res = await deletePageAction(page.id);
                  toast({
                    variant: res.error ? 'destructive' : 'success',
                    description: res.success
                      ? 'Сторінка видалена'
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