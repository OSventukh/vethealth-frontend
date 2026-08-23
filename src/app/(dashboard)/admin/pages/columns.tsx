"use client";
import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	ChevronDownCircleIcon,
	ChevronRightCircle,
} from "lucide-react";
import Link from "next/link";
import type { PageResponse } from "@/api/types/pages.type";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/app/(dashboard)/admin/components/row-actions";
import { deletePageAction } from "./actions/delete-page.action";

export const pageColumns: ColumnDef<PageResponse>[] = [
	{
		accessorKey: "title",
		header: "Заголовок",
		cell: ({ row }) => {
			const page = row.original as PageResponse;

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
						<Link href={"pages/edit/" + page.slug}>{page.title}</Link>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => {
						column.toggleSorting(column.getIsSorted() === "asc");
					}}
				>
					Статус
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "slug",
		header: "URL адреса",
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => {
						column.toggleSorting(column.getIsSorted() === "asc");
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
			return <>{date.toLocaleDateString("uk-UA")}</>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const page = row.original as PageResponse;
			return (
				<RowActions
					id={page.id}
					name={page.title}
					entityName="сторінку"
					editHref={"pages/edit/" + page.slug}
					successMessage="Сторінка видалена"
					deleteAction={deletePageAction}
				/>
			);
		},
	},
];
