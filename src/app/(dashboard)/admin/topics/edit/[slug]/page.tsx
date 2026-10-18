import { Suspense } from "react";
import { api } from "@/api";
import { auth } from "@/lib/session/auth";
import EditTopic from "../../components/EditTopic";
import { TopicEditorSkeleton } from "../../components/EditTopic/topic-editor-skeleton";

type Props = {
	params: Promise<{ slug: string }>;
};

export default function EditTopicPage({ params }: Props) {
	return (
		<Suspense fallback={<TopicEditorSkeleton />}>
			<TopicEditorLoader params={params} />
		</Suspense>
	);
}

async function TopicEditorLoader({ params }: Props) {
	const [{ slug }, session] = await Promise.all([params, auth()]);
	const [topic, categories, topics, pages] = await Promise.all([
		api.topics.getOne({
			slug,
			token: session?.token,
			query: { include: "parent,categories,children" },
		}),
		api.categories.getMany({ tags: ["categories"] }),
		api.topics.getMany({
			tags: ["topics"],
			query: { include: "categories" },
		}),
		api.pages.getMany({ tags: ["pages"] }),
	]);

	return (
		<EditTopic
			initialData={topic}
			categories={categories?.items || []}
			topics={topics?.items || []}
			pages={pages?.items || []}
			editMode
		/>
	);
}
