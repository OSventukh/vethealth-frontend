'use client';
import Link from 'next/link';
import Image from 'next/image';
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
import { TopicResponse } from '@/api/types/topics.type';
import type { Image as ImageType, Status } from '@/api/types/general.type';
import { IconButton } from '@/components/ui/icon-button';

export const topicColumns: ColumnDef<TopicResponse>[] = [
  {
    accessorKey: 'title',
    header: 'Заголовок',
    cell: ({ row }) => {
      const topic = row.original as TopicResponse;

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
            <Link href={'topics/edit/' + topic.slug}>{topic.title}</Link>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'image',
    header: 'Картинка',

    cell: ({ getValue }) => {
      const value = getValue() as ImageType;
      return (
        <div className="flex justify-center items-center w-10 overflow-hidden">
          <Image
            className="w-auto"
            src={value.path}
            width={50}
            height={50}
            alt="topic image"
          />
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
      const value = getValue() as Status;
      if (value.name === 'Active') {
        return 'Активна';
      }
      return 'Неактивна';
    },
  },
  {
    accessorKey: 'slug',
    header: 'URL адреса',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const topic = row.original as TopicResponse;
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
                onClick={() => navigator.clipboard.writeText(topic.id)}
              >
                <Copy size={16} /> Копіювати адресу
              </DropdownMenuItem>
              <Link href={'topics/edit/' + topic.slug}>
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
              <DialogTitle>Видалити тему</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Ви впевненні що хочете видалити тему &quot;{topic.title}&quot;?
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
