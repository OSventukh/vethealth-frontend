'use client';
import Link from 'next/link';
import {
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
import { CategoryResponse } from '@/api/types/categories.type';

export const categoryColumns: ColumnDef<CategoryResponse>[] = [
  {
    accessorKey: 'name',
    header: 'Заголовок',
    cell: ({ row }) => {
      const category = row.original as CategoryResponse;
      return (
        <div
          className="flex gap-1 items-center"
          style={{ paddingLeft: `${row.depth}rem` }}
        >
          <div className="flex justify-center items-center w-10">
            {row.getCanExpand() && (
              <button
                className="h-10 w-10 p-2 flex justify-center items-center rounded-full text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                onClick={() => row.toggleExpanded()}
                // onClick: () =>row.getToggleExpandedHandler(),
                // style: { cursor: 'pointer' },
              >
                {row.getIsExpanded() ? (
                  <ChevronDownCircleIcon size={15} />
                ) : (
                  <ChevronRightCircle size={15} />
                )}
              </button>
            )}
          </div>
          <div>
            <Link href={'categories/edit/' + category.slug}>
              {category.name}
            </Link>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'slug',
    header: 'URL адреса',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const category = row.original as CategoryResponse;
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
                onClick={() => navigator.clipboard.writeText(category.id)}
              >
                <Copy size={16} /> Копіювати адресу
              </DropdownMenuItem>
              <Link href={'categories/edit/' + category.slug}>
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
              Ви впевненні що хочете видалити статтю &quot;{category.name}
              &quot;?
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
