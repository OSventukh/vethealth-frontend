import { type FieldPath, useFormContext, useWatch } from "react-hook-form";
import type { GeneratedSeoMetadata } from "@/app/(dashboard)/admin/actions/generate-seo.action";
import { GenerateSeoButton } from "@/app/(dashboard)/admin/components/generate-seo-button";
import type { TopicResponse } from "@/api/types/topics.type";
import { Card, CardContent } from "@/components/ui/card";
import { prepareSeoContext } from "@/lib/seo-content-context";
import {
	DEFAULT_SEO_FIELDS,
	SEO_FIELDS,
	type SeoDraft,
} from "@/app/(dashboard)/admin/seo/seo-fields";
import { extractLexicalText } from "@/lib/content-text";
import type { PostValues } from "@/utils/validators/form.validator";
import { IndexingCard } from "./indexing-card";
import { MetaTagsCard } from "./meta-tags-card";
import { OpenGraphCard } from "./open-graph-card";
import { SeoReadinessCard } from "./seo-readiness-card";

type Props = {
	words: number;
	topicsOptions?: TopicResponse[];
};

const GENERATED_FIELDS: Array<
	[FieldPath<PostValues>, keyof GeneratedSeoMetadata]
> = [
	["metadata.metaTitle", "metaTitle"],
	["metadata.metaDescription", "metaDescription"],
	["metadata.metaKeywords", "metaKeywords"],
	["metadata.ogTitle", "ogTitle"],
	["metadata.ogDescription", "ogDescription"],
];

export function SeoTab({ words, topicsOptions }: Props) {
	const form = useFormContext<PostValues>();
	const metadata = useWatch({ control: form.control, name: "metadata" });

	const getGenerateInput = () => {
		const values = form.getValues();
		const selectedTopics = topicsOptions
			?.filter((topic) => values.topics?.some(({ id }) => id === topic.id))
			.map((topic) => topic.title);
		return {
			title: values.title || "",
			...prepareSeoContext(
				extractLexicalText(values.content || "", undefined, true),
			),
			current: Object.fromEntries(
				SEO_FIELDS.map((field) => [field, values.metadata?.[field] ?? ""]),
			) as SeoDraft,
			fields: DEFAULT_SEO_FIELDS.filter(
				(field) => !values.metadata?.[field]?.trim(),
			),
			topics: selectedTopics,
			entityType: "post" as const,
		};
	};

	// Заповнює лише порожні поля: ручні значення редактора не перетираються.
	const applyGenerated = (generated: GeneratedSeoMetadata): number => {
		let applied = 0;
		for (const [field, key] of GENERATED_FIELDS) {
			const current = form.getValues(field);
			const value = generated[key]?.trim();
			if ((typeof current === "string" && current.trim()) || !value) {
				continue;
			}
			form.setValue(field, value, { shouldDirty: true, shouldValidate: true });
			applied += 1;
		}
		return applied;
	};

	return (
		<div className="flex flex-col gap-4">
			<SeoReadinessCard words={words} topicsOptions={topicsOptions} />
			<Card>
				<CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
					<div>
						<div className="text-sm font-bold">ШІ-заповнення мета-полів</div>
						<p className="text-muted-foreground text-sm">
							Згенерує порожні поля (title, description, OG) з тексту статті.
							Заповнені вручну — не чіпає.
						</p>
					</div>
					<GenerateSeoButton
						getInput={getGenerateInput}
						onGenerated={applyGenerated}
						values={{
							metaTitle: metadata?.metaTitle ?? "",
							metaDescription: metadata?.metaDescription ?? "",
							metaKeywords: metadata?.metaKeywords ?? "",
							ogTitle: metadata?.ogTitle ?? "",
							ogDescription: metadata?.ogDescription ?? "",
						}}
					/>
				</CardContent>
			</Card>
			<MetaTagsCard />
			<OpenGraphCard />
			<IndexingCard />
		</div>
	);
}
