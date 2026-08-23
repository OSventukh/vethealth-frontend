"use client";
import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	ChevronDownCircleIcon,
	ChevronRightCircle,
} from "lucide-react";
import Link from "next/link";
import type { PostResponse } from "@/api/types/posts.type";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/app/(dashboard)/admin/components/row-actions";
import { deletePostAction } from "./actions/delete-post.action";

export const postColumns: ColumnDef<PostResponse>[] = [
	{
		accessorKey: "title",
		header: "Заголовок",
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
						<Link href={"posts/edit/" + post.slug}>{post.title}</Link>
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
		cell: ({ getValue }) => {
			const value = getValue() as string;
			if (value === "Published") {
				return (
					<span className="w-full rounded-full bg-green-500 px-4 py-1 text-center text-white">
						Опубліковано
					</span>
				);
			}
			if (value === "Draft") {
				return (
					<span className="w-full rounded-full bg-yellow-500 px-4 py-1 text-center text-white">
						Чернетка
					</span>
				);
			}

			if (value === "OnReview") {
				return (
					<span className="w-full rounded-full bg-blue-500 px-4 py-1 text-center text-white">
						На рецензії
					</span>
				);
			}
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
			const post = row.original as PostResponse;
			return (
				<RowActions
					id={post.id}
					name={post.title}
					entityName="статтю"
					editHref={"posts/edit/" + post.slug}
					successMessage="Стаття видалена"
					deleteAction={deletePostAction}
				/>
			);
		},
	},
];
