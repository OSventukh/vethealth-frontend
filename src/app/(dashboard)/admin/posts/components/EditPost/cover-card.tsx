import { LinkIcon, Trash2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { imageUploadAction } from "@/actions/image-upload.action";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PostValues } from "@/utils/validators/form.validator";

export function CoverCard() {
	const form = useFormContext<PostValues>();
	const file = form.watch("featuredImageFile");
	const url = form.watch("featuredImageUrl");
	const preview = file?.path || url;

	const clear = () => {
		form.setValue("featuredImageFile", null, { shouldDirty: true });
		form.setValue("featuredImageUrl", "", { shouldDirty: true });
	};

	return (
		<Card className="flex flex-col gap-4 p-5">
			<div className="text-sm font-bold">Обкладинка</div>
			{preview ? (
				<div>
					<div
						role="img"
						aria-label="Обкладинка статті"
						className="aspect-[16/10] w-full rounded-lg border bg-cover bg-center"
						style={{ backgroundImage: `url(${preview})` }}
					/>
					<Button
						variant="outline"
						size="sm"
						className="mt-3 w-full gap-2"
						onClick={clear}
					>
						<Trash2Icon size={14} /> Видалити
					</Button>
				</div>
			) : (
				<Tabs defaultValue="upload" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="upload">Завантажити</TabsTrigger>
						<TabsTrigger value="url" className="gap-1.5">
							<LinkIcon size={13} />
							URL-адреса
						</TabsTrigger>
					</TabsList>
					<TabsContent value="upload">
						<FormField
							control={form.control}
							name="featuredImageFile"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<ImageUpload
											field="post-featured"
											uploadAction={imageUploadAction}
											width={500}
											height={500}
											onImage={(image) => field.onChange(image)}
											value={field.value?.path || null}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</TabsContent>
					<TabsContent value="url">
						<FormField
							control={form.control}
							name="featuredImageUrl"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="https://…"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</TabsContent>
				</Tabs>
			)}
		</Card>
	);
}
