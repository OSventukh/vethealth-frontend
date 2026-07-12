import { useFormContext } from "react-hook-form";
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
import { SITE_HOST } from "@/utils/constants/generals";
import type { PostValues } from "@/utils/validators/form.validator";
import { FieldCounter } from "./field-counter";
import { KeywordsInput } from "./keywords-input";

export function MetaTagsCard() {
	const form = useFormContext<PostValues>();
	const title = form.watch("title");

	return (
		<Card>
			<CardHeader className="pb-4">
				<CardTitle className="text-sm font-bold">Мета-теги</CardTitle>
				<CardDescription>
					Те, що Google і соцмережі бачать першим
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				<FormField
					control={form.control}
					name="metadata.metaTitle"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel>Meta Title</FormLabel>
								<FieldCounter
									value={field.value?.length || 0}
									ideal={[40, 60]}
									max={70}
								/>
							</div>
							<FormControl>
								<Input
									placeholder={title || "Заголовок для пошукових систем"}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Якщо порожньо — використається заголовок статті. Рекомендовано
								40–60 символів.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="metadata.metaDescription"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel>Meta Description</FormLabel>
								<FieldCounter
									value={field.value?.length || 0}
									ideal={[120, 160]}
									max={180}
								/>
							</div>
							<FormControl>
								<Textarea
									placeholder="Стислий опис, що зʼявиться в результатах пошуку…"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Зробіть опис конкретним і додайте ключове слово. Ідеально —
								120–160 символів.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid gap-5 md:grid-cols-2">
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>URL-slug</FormLabel>
								<FormControl>
									<div className="border-input bg-background flex items-stretch overflow-hidden rounded-md border">
										<span className="bg-primary/10 text-muted-foreground flex items-center px-3 font-mono text-xs">
											{SITE_HOST}/
										</span>
										<input
											{...field}
											type="text"
											className="text-primary min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm font-semibold outline-none"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="metadata.canonicalUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Canonical URL</FormLabel>
								<FormControl>
									<Input
										placeholder={`https://${SITE_HOST}/…`}
										className="font-mono text-sm"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="metadata.metaKeywords"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel>Ключові слова</FormLabel>
								<span className="text-muted-foreground text-[11px]">
									{field.value
										? field.value.split(",").filter((keyword) => keyword.trim())
												.length
										: 0}{" "}
									додано
								</span>
							</div>
							<FormControl>
								<KeywordsInput
									value={field.value || ""}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
}
