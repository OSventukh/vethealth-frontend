"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDownCircleIcon, ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import type { CategoryResponse } from "@/api/types/categories.type";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/app/(dashboard)/admin/components/row-actions";
import { deleteCategoryAction } from "./actions/delete-category.action";

export const categoryColumns: ColumnDef<CategoryResponse>[] = [
	{
		accessorKey: "name",
		header: "Заголовок",
		cell: ({ row }) => {
			const category = row.original as CategoryResponse;
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
						<Link href={"categories/edit/" + category.slug}>
							{category.name}
						</Link>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "slug",
		header: "URL адреса",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const category = row.original as CategoryResponse;
			return (
				<RowActions
					id={category.id}
					name={category.name}
					entityName="категорію"
					editHref={"categories/edit/" + category.slug}
					successMessage="Категорія видалена"
					deleteAction={deleteCategoryAction}
				/>
			);
		},
	},
];
