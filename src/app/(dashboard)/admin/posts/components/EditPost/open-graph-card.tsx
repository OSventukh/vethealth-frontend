import { XIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { imageUploadAction } from "@/actions/image-upload.action";
import ImageUpload from "@/components/ImageUpload";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PostValues } from "@/utils/validators/form.validator";
import { SegmentedControl } from "./segmented-control";
import { SocialPreview } from "./social-preview";

export function OpenGraphCard() {
	const form = useFormContext<PostValues>();
	const [network, setNetwork] = useState<"facebook" | "twitter">("facebook");
	const [title, metadata] = useWatch({
		control: form.control,
		name: ["title", "metadata"],
	});

	return (
		<Card>
			<CardHeader className="flex-row items-start justify-between space-y-0 pb-4">
				<div className="space-y-1.5">
					<CardTitle className="text-sm font-bold">
						Соцмережі · Open Graph
					</CardTitle>
					<CardDescription>
						Як пост виглядатиме у Facebook, Telegram, X та інших
					</CardDescription>
				</div>
				<SegmentedControl
					value={network}
					onChange={setNetwork}
					options={[
						{ value: "facebook", label: "Facebook" },
						{ value: "twitter", label: "X/Twitter" },
					]}
				/>
			</CardHeader>
			<CardContent className="grid items-start gap-6 lg:grid-cols-2">
				<div className="flex flex-col gap-5">
					<FormField
						control={form.control}
						name="metadata.ogTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>OG Title</FormLabel>
								<FormControl>
									<Input
										placeholder={metadata?.metaTitle || title || "Заголовок"}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="metadata.ogDescription"
						render={({ field }) => (
							<FormItem>
								<FormLabel>OG Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder={
											metadata?.metaDescription || "Опис для соцмереж"
										}
										className="min-h-[72px]"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="metadata.ogImage"
						render={({ field }) => (
							<FormItem>
								<FormLabel>OG Image · 1200×630</FormLabel>
								{field.value ? (
									<div className="relative">
										<div
											role="img"
											aria-label="OG-зображення"
											className="aspect-[1.91/1] w-full rounded-lg border bg-cover bg-center"
											style={{ backgroundImage: `url(${field.value})` }}
										/>
										<button
											type="button"
											onClick={() => field.onChange("")}
											className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-white"
										>
											<XIcon size={12} /> Прибрати
										</button>
									</div>
								) : (
									<div className="flex flex-col gap-2">
										<FormControl>
											<Input
												placeholder="https://… або завантажте нижче"
												className="font-mono text-sm"
												{...field}
											/>
										</FormControl>
										<ImageUpload
											field="post-featured"
											uploadAction={imageUploadAction}
											width={1200}
											height={630}
											onImage={(image) => field.onChange(image?.path || "")}
											value={null}
										/>
									</div>
								)}
								<FormDescription>PNG/JPG · 1200×630 · до 2 MB</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="metadata.twitterCard"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Twitter Card</FormLabel>
								<FormControl>
									<SegmentedControl
										value={field.value}
										onChange={field.onChange}
										options={[
											{ value: "summary", label: "Summary" },
											{ value: "summary_large_image", label: "Summary Large" },
										]}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<SocialPreview
					mode={network}
					title={
						metadata?.ogTitle ||
						metadata?.metaTitle ||
						title ||
						"Заголовок поста"
					}
					description={
						metadata?.ogDescription || metadata?.metaDescription || "Опис поста"
					}
					image={metadata?.ogImage || undefined}
				/>
			</CardContent>
		</Card>
	);
}
