import { SparklesIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import type { TopicResponse } from "@/api/types/topics.type";
import { Card } from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { SITE_HOST } from "@/utils/constants/generals";
import { slugifyUk } from "@/utils/slugify";
import type { PostValues } from "@/utils/validators/form.validator";
import { FieldCounter } from "./field-counter";

const Lexical = dynamic(
	() => import("@/app/(dashboard)/admin/components/Editor/Lexical"),
	{
		ssr: false,
	},
);

type ContentStats = {
	words: number;
	chars: number;
};

type Props = {
	initialContent?: string | null;
	topicsOptions?: TopicResponse[];
	stats: ContentStats;
	onStatsChange: (stats: ContentStats) => void;
};

export function ContentTab({
	initialContent,
	topicsOptions,
	stats,
	onStatsChange,
}: Props) {
	const form = useFormContext<PostValues>();
	const selectedTopics = form.watch("topics");
	const topicSlug =
		topicsOptions?.find((topic) => topic.id === selectedTopics?.[0]?.id)
			?.slug || "…";
	const readingMinutes = Math.max(1, Math.round(stats.words / 180));

	return (
		<div className="flex flex-col gap-4">
			<Card className="p-6 md:px-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<div className="mb-2 flex items-center justify-between">
								<span className="text-primary text-[11px] font-bold tracking-[.16em] uppercase">
									Заголовок · h1
								</span>
								<FieldCounter
									value={field.value.length}
									ideal={[40, 65]}
									max={80}
								/>
							</div>
							<FormControl>
								<input
									{...field}
									type="text"
									placeholder="Назва, яка зачепить власника тварини…"
									className="placeholder:text-muted-foreground/60 w-full border-0 bg-transparent text-2xl leading-tight font-bold tracking-tight outline-none md:text-4xl"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem className="mt-4 border-t border-dashed pt-4">
							<div className="text-muted-foreground flex items-center gap-1 font-mono text-sm">
								<span>
									{SITE_HOST}/{topicSlug}/
								</span>
								<FormControl>
									<input
										{...field}
										type="text"
										placeholder="url-adresa-statti"
										className="border-primary/40 text-primary min-w-0 flex-1 border-0 border-b border-dashed bg-transparent py-0.5 font-semibold outline-none"
									/>
								</FormControl>
								<button
									type="button"
									onClick={() =>
										form.setValue("slug", slugifyUk(form.getValues("title")), {
											shouldDirty: true,
											shouldValidate: true,
										})
									}
									className="text-primary bg-primary/10 hover:bg-primary/20 flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors"
								>
									<SparklesIcon size={13} />
									Згенерувати
								</button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</Card>

			<Lexical
				hideTitle
				initialContent={initialContent || undefined}
				onChangeContent={(content) =>
					form.setValue("content", content, { shouldDirty: true })
				}
				onChangeText={(text) => {
					const trimmed = text.trim();
					onStatsChange({
						words: trimmed ? trimmed.split(/\s+/).length : 0,
						chars: trimmed.length,
					});
				}}
				className="h-auto max-w-none overflow-visible md:h-auto"
				toolbarWrapperClassName="sticky top-0 z-30"
				contentClassName="mt-2 flex h-auto min-h-[32rem] flex-col resize-none overflow-visible rounded-lg border bg-card shadow-sm md:h-auto [&>div:has([contenteditable])]:grid [&>div:has([contenteditable])]:grid-rows-[1fr] [&_[contenteditable]]:border-0 [&_[contenteditable]]:bg-transparent [&_[contenteditable]]:shadow-none"
				footer={
					<div className="not-prose text-muted-foreground flex flex-wrap items-center gap-2 border-t border-dashed px-6 py-3 text-xs md:px-10">
						<span>
							<b className="text-foreground font-semibold">{stats.words}</b>{" "}
							слів
						</span>
						<span className="opacity-40">·</span>
						<span>
							<b className="text-foreground font-semibold">{stats.chars}</b>{" "}
							символів
						</span>
						<span className="opacity-40">·</span>
						<span>~{readingMinutes} хв читання</span>
					</div>
				}
			/>
		</div>
	);
}
