import type { TopicResponse } from "@/api/types/topics.type";
import { IndexingCard } from "./indexing-card";
import { MetaTagsCard } from "./meta-tags-card";
import { OpenGraphCard } from "./open-graph-card";
import { SeoReadinessCard } from "./seo-readiness-card";

type Props = {
	words: number;
	topicsOptions?: TopicResponse[];
};

export function SeoTab({ words, topicsOptions }: Props) {
	return (
		<div className="flex flex-col gap-4">
			<SeoReadinessCard words={words} topicsOptions={topicsOptions} />
			<MetaTagsCard />
			<OpenGraphCard />
			<IndexingCard />
		</div>
	);
}
