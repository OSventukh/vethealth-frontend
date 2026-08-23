"use client";
import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	ChevronDownCircleIcon,
	ChevronRightCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Image as ImageType, Status } from "@/api/types/general.type";
import type { TopicResponse } from "@/api/types/topics.type";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/app/(dashboard)/admin/components/row-actions";
import { deleteTopicAction } from "./actions/delete-topic.action";

export const topicColumns: ColumnDef<TopicResponse>[] = [
	{
		accessorKey: "title",
		header: "Заголовок",
		cell: ({ row }) => {
			const topic = row.original as TopicResponse;

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
						<Link href={"topics/edit/" + topic.slug}>{topic.title}</Link>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "image",
		header: "Картинка",

		cell: ({ getValue }) => {
			const value = getValue() as ImageType;

			return (
				<div className="flex w-10 items-center justify-center overflow-hidden">
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
			const value = getValue() as Status;
			if (value.name === "Active") {
				return "Активна";
			}
			return "Неактивна";
		},
	},
	{
		accessorKey: "slug",
		header: "URL адреса",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const topic = row.original as TopicResponse;
			return (
				<RowActions
					id={topic.id}
					name={topic.title}
					entityName="тему"
					editHref={"topics/edit/" + topic.slug}
					successMessage="Тема видалена"
					deleteAction={deleteTopicAction}
				/>
			);
		},
	},
];
