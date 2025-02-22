'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './TablePagination';
import TableSearch from './TableSearch';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  searchField: string;
  childrenProp?: keyof TData;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  searchField,
  childrenProp,
}: DataTableProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex:
      Number(params.get('page')) > 0 ? Number(params.get('page')) - 1 : 0,
    pageSize: Number(params.get('size')) || 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searching, setSearching] = useState<string>('');
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    autoResetAll: false,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onExpandedChange: setExpanded,
    getSubRows: (row) => (childrenProp ? (row?.[childrenProp] as TData[]) : []),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
    state: {
      sorting,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      expanded,
    },
  });

  useEffect(() => {
    if (sorting.length > 0) {
      params.set('orderBy', sorting[0].id);
      params.set('sort', sorting[0].desc ? 'desc' : 'asc');
      replace(`${pathname}?${params.toString()}`);
    }
    if (pagination) {
      params.set('page', String(pagination.pageIndex + 1));
      params.set('size', String(pagination.pageSize));
      if (pagination.pageIndex === 0) {
        params.delete('page');
      }
      if (pagination.pageSize === 10) {
        params.delete('size');
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    if (searching) {
      params.set(searchField, searching);
      replace(`${pathname}?${params.toString()}`);
    }

    if (searching === '') {
      params.delete(searchField);
      replace(`${pathname}?${params.toString()}`);
    }
  }, [sorting, pagination, replace, params, pathname, searchField, searching]);

  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value) {
      setSearching(value);
    }
    if (!value || value === '') {
      setSearching('');
    }
  };
  return (
    <div className="bg-background mt-5 flex w-full flex-col gap-5 rounded-2xl border p-4 md:p-10">
      <TableSearch value={searching} onChange={searchChangeHandler} />
      <div className="w-full rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.column.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Немає результатів.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
