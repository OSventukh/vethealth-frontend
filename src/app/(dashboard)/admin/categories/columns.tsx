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
import { deleteCategoryAction } from './actions/delete-category.action';
import { toast } from '@/components/ui/use-toast';
import { IconButton } from '@/components/ui/icon-button';

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
              <div className="flex w-full h-full justify-end">
                <IconButton icon={<MoreHorizontal size={15} />}>
                  <span className="sr-only">Open menu</span>
                </IconButton>
              </div>
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
              <DialogTitle>Видалити категорію</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Ви впевненні що хочете видалити категорію &quot;{category.name}
              &quot;?
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={async () => {
                  const res = await deleteCategoryAction(category.id);
                  toast({
                    variant: res.error ? 'destructive' : 'success',
                    description: res.success
                      ? 'Категорія видалена'
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
