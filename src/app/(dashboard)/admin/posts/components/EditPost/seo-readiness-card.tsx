import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { TopicResponse } from "@/api/types/topics.type";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SITE_HOST } from "@/utils/constants/generals";
import type { PostValues } from "@/utils/validators/form.validator";
import { GooglePreview } from "./google-preview";
import { ScoreRing } from "./score-ring";
import { SegmentedControl } from "./segmented-control";
import { computeSeoScore } from "./seo-score";

type Props = {
	words: number;
	topicsOptions?: TopicResponse[];
};

export function SeoReadinessCard({ words, topicsOptions }: Props) {
	const { control } = useFormContext<PostValues>();
	const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
	const [title, slug, topics, metadata] = useWatch({
		control,
		name: ["title", "slug", "topics", "metadata"],
	});

	const score = computeSeoScore({
		title: title || "",
		slug: slug || "",
		words,
		metadata: metadata || {},
	});
	const scoreLabel =
		score >= 80 ? "Чудово" : score >= 50 ? "Можна краще" : "Потребує уваги";
	const scoreTone =
		score >= 80
			? "bg-green-500/15 text-green-700"
			: score >= 50
				? "bg-amber-500/15 text-amber-700"
				: "bg-red-500/15 text-red-700";

	const topicSlug =
		topicsOptions?.find((topic) => topic.id === topics?.[0]?.id)?.slug || "…";

	return (
		<Card className="p-6">
			<div className="grid items-start gap-6 md:grid-cols-[160px_1fr]">
				<div className="flex flex-col items-center gap-2">
					<ScoreRing value={score} />
					<div className="text-muted-foreground text-xs">SEO-готовність</div>
					<span
						className={cn(
							"rounded-full px-3 py-1 text-xs font-semibold",
							scoreTone,
						)}
					>
						{scoreLabel}
					</span>
				</div>
				<div>
					<div className="mb-3 flex items-center justify-between gap-2">
						<div className="text-sm font-bold">Превʼю в Google</div>
						<SegmentedControl
							value={device}
							onChange={setDevice}
							options={[
								{ value: "desktop", label: "Desktop" },
								{ value: "mobile", label: "Mobile" },
							]}
						/>
					</div>
					<GooglePreview
						mode={device}
						title={metadata?.metaTitle || title || "Заголовок поста"}
						url={`${SITE_HOST} › ${topicSlug} › ${slug || "url-adresa"}`}
						description={
							metadata?.metaDescription ||
							"Опис зʼявиться тут, коли ви заповните мета-опис. Google показує приблизно 155–160 символів."
						}
					/>
				</div>
			</div>
		</Card>
	);
}
