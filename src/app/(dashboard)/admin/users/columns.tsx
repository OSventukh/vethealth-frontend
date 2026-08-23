"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDownCircleIcon, ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import type { UserResponse } from "@/api/types/user.type";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/app/(dashboard)/admin/components/row-actions";
import { deleteUserAction } from "./actions/delete-user.action";

export const userColumns: ColumnDef<UserResponse>[] = [
	{
		accessorKey: "firstname",
		header: "Ім'я",
		cell: ({ row }) => {
			const user = row.original as UserResponse;
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
						<Link href={"users/" + user.id}>{user.firstname}</Link>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "lastname",
		header: "Прізвище",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Роль",
		cell: ({ row }) => {
			const user = row.original as UserResponse;
			return <>{user.role.name}</>;
		},
	},
	{
		accessorKey: "status",
		header: "Статус",
		cell: ({ row }) => {
			const user = row.original as UserResponse;
			return <>{user.status.name}</>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const user = row.original as UserResponse;
			const isAdmin = user.role.id === "1";
			return (
				<RowActions
					id={user.id}
					name={user.firstname}
					entityName="користувача"
					editHref={"users/edit/" + user.id}
					successMessage="Користувач видалений"
					deleteAction={isAdmin ? undefined : deleteUserAction}
				/>
			);
		},
	},
];
