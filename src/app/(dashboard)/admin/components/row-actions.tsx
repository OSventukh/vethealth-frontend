"use client";
import { Copy, FileEdit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { toast } from "@/components/ui/use-toast";

export interface DeleteResult {
	error: boolean;
	success: boolean;
	message: string;
}

interface RowActionsProps {
	id: string;
	name: string;
	/** Назва сутності в знахідному відмінку: «Видалити {entityName}» */
	entityName: string;
	editHref: string;
	successMessage: string;
	deleteAction?: (id: string) => Promise<DeleteResult>;
}

export function RowActions({
	id,
	name,
	entityName,
	editHref,
	successMessage,
	deleteAction,
}: RowActionsProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		if (!deleteAction) return;

		setIsDeleting(true);
		const res = await deleteAction(id);
		setIsDeleting(false);
		toast({
			variant: res.error ? "destructive" : "success",
			description: res.success ? successMessage : res.message,
		});
		if (!res.error) setDeleteDialogOpen(false);
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<IconButton
							icon={<MoreHorizontal size={15} />}
							aria-label="Відкрити меню"
							className="ml-auto"
						/>
					}
				/>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						className="gap-2"
						onClick={() => navigator.clipboard.writeText(id)}
					>
						<Copy size={16} /> Копіювати адресу
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link href={editHref} />} className="gap-2">
						<FileEdit size={16} />
						Редагувати
					</DropdownMenuItem>
					{deleteAction && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="gap-2 text-red-700 focus:text-red-700"
								onClick={() => setDeleteDialogOpen(true)}
							>
								<Trash2 size={16} />
								Видалити
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			{deleteAction && (
				<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Видалити {entityName}</DialogTitle>
						</DialogHeader>
						<DialogDescription>
							Ви впевненні що хочете видалити &quot;{name}&quot;?
						</DialogDescription>
						<DialogFooter>
							<Button
								variant="destructive"
								disabled={isDeleting}
								onClick={handleDelete}
							>
								{isDeleting ? "Видалення…" : "Видалити"}
							</Button>
							<DialogClose render={<Button disabled={isDeleting} />}>
								Скасувати
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
