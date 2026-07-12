import { SaveIcon, SendIcon, UserIcon, ViewIcon } from "lucide-react";
import type { PostResponse } from "@/api/types/posts.type";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UserRoleEnum } from "@/utils/enums/user.enum";
import type { UserSession } from "@/utils/types/user.type";
import { PostStatusEnum } from "../../actions/post-status.enum";

type Props = {
	status?: PostResponse["status"];
	user?: UserSession;
	isPending: boolean;
	onSave: (status: PostStatusEnum) => void;
};

const STATUS_BADGE: Record<
	NonNullable<PostResponse["status"]>,
	{ label: string; className: string }
> = {
	Published: { label: "Опубліковано", className: "bg-green-500" },
	Draft: { label: "Чернетка", className: "bg-yellow-500" },
	OnReview: { label: "На рецензії", className: "bg-blue-500" },
};

export function PublishCard({ status, user, isPending, onSave }: Props) {
	const badge = STATUS_BADGE[status || "Draft"];
	const isAdmin =
		user?.role.name === UserRoleEnum.Administrator ||
		user?.role.name === UserRoleEnum.SuperAdmininstrator;

	return (
		<Card className="overflow-hidden p-0">
			<div className="flex items-start justify-between gap-2 px-5 pt-4">
				<div className="text-sm font-bold">Публікація</div>
				<span
					className={cn(
						"rounded-full px-3 py-0.5 text-xs font-semibold text-white",
						badge.className,
					)}
				>
					{badge.label}
				</span>
			</div>

			<div className="flex flex-col gap-2 p-5 pt-4">
				{isAdmin ? (
					<Button
						className="gap-2"
						disabled={isPending}
						onClick={() => onSave(PostStatusEnum.Published)}
					>
						<SendIcon size={16} /> Опублікувати
					</Button>
				) : (
					<Button
						className="gap-2"
						disabled={isPending}
						onClick={() => onSave(PostStatusEnum.OnReview)}
					>
						<ViewIcon size={16} /> На перегляд
					</Button>
				)}
				<Button
					variant="outline"
					className="gap-2"
					disabled={isPending}
					onClick={() => onSave(PostStatusEnum.Draft)}
				>
					<SaveIcon size={16} /> Зберегти чернетку
				</Button>
			</div>

			<div className="bg-muted/40 text-muted-foreground flex items-center justify-between border-t px-5 py-3 text-sm">
				<span className="flex items-center gap-2 font-medium">
					<UserIcon size={14} />
					Автор
				</span>
				<span className="text-foreground font-semibold">
					{[user?.firstname, user?.lastname].filter(Boolean).join(" ") || "—"}
				</span>
			</div>
		</Card>
	);
}
