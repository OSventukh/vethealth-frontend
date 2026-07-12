import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type { PostValues } from "@/utils/validators/form.validator";
import { deletePostAction } from "../../actions/delete-post.action";

type Props = {
	editMode?: boolean;
	postId?: string;
	postTitle?: string;
};

export function SettingsTab({ editMode, postId, postTitle }: Props) {
	const form = useFormContext<PostValues>();
	const router = useRouter();
	const { toast } = useToast();

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader className="pb-4">
					<CardTitle className="text-sm font-bold">Адреса статті</CardTitle>
					<CardDescription>
						Та сама URL-адреса, що й у табах «Контент» і «SEO»
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>URL-slug</FormLabel>
								<FormControl>
									<Input
										placeholder="url-adresa-statti"
										className="max-w-md font-mono text-sm"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Якщо залишити порожнім — згенерується автоматично із
									заголовка.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>
			</Card>

			{editMode && postId && (
				<Card className="border-destructive/40">
					<CardHeader className="pb-4">
						<CardTitle className="text-destructive text-sm font-bold">
							Небезпечна зона
						</CardTitle>
						<CardDescription>
							Видалення статті незворотне — вона зникне з сайту та адмінки.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="destructive" className="gap-2">
									<Trash2Icon size={15} />
									Видалити пост
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Видалити статтю</DialogTitle>
								</DialogHeader>
								<DialogDescription>
									Ви впевненні що хочете видалити статтю &quot;{postTitle}
									&quot;?
								</DialogDescription>
								<DialogFooter>
									<Button
										variant="destructive"
										onClick={async () => {
											const res = await deletePostAction(postId);
											toast({
												variant: res.error ? "destructive" : "success",
												description: res.success
													? "Стаття видалена"
													: res.message,
											});
											if (res.success) {
												router.push("/admin/posts");
											}
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
					</CardContent>
				</Card>
			)}
		</div>
	);
}
