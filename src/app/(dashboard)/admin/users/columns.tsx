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
import { toast } from '@/components/ui/use-toast';
import { IconButton } from '@/components/ui/icon-button';
import { UserResponse } from '@/api/types/user.type';
import { deleteUserAction } from './actions/delete-user.action';

export const userColumns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: 'firstname',
    header: "Ім'я",
    cell: ({ row }) => {
      const user = row.original as UserResponse;
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
            <Link href={'users/' + user.id}>{user.firstname}</Link>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'lastname',
    header: 'Прізвище',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Роль',
    cell: ({ row }) => {
      const user = row.original as UserResponse;
      return <>{user.role.name}</>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ({ row }) => {
      const user = row.original as UserResponse;
      return <>{user.status.name}</>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original as UserResponse;

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
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                <Copy size={16} /> Копіювати адресу
              </DropdownMenuItem>
              <Link href={'users/edit/' + user.id}>
                <DropdownMenuItem className="gap-2">
                  <FileEdit size={16} />
                  Редагувати
                </DropdownMenuItem>
              </Link>
              {user.role.id !== '1' && (
                <>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                    <DropdownMenuItem className="gap-2 text-red-700 focus:text-red-700">
                      <Trash2 size={16} />
                      Видалити
                    </DropdownMenuItem>
                  </DialogTrigger>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Видалити користувача</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Ви впевненні що хочете видалити користувача &quot;{user.firstname}
              &quot;?
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={async () => {
                  const res = await deleteUserAction(user.id);
                  toast({
                    variant: res.error ? 'destructive' : 'success',
                    description: res.success
                      ? 'Користувач видалений'
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
