import { Suspense } from "react";
import { api } from "@/api";
import { auth } from "@/lib/session/auth";
import EditPost from "../../components/EditPost";
import { PostEditorSkeleton } from "../../components/EditPost/post-editor-skeleton";

type Props = { params: Promise<{ slug: string }> };

export default function EditPostPage({ params }: Props) {
	return (
		<Suspense fallback={<PostEditorSkeleton />}>
			<PostEditorLoader params={params} />
		</Suspense>
	);
}

async function PostEditorLoader({ params }: Props) {
	const [{ slug }, session] = await Promise.all([params, auth()]);

	const [post, topics, categories] = await Promise.all([
		api.posts.getOne({
			slug,
			query: { include: "categories,topics,metadata" },
			token: session?.token,
		}),
		api.topics.getMany({
			query: { showAll: true },
			tags: ["topics"],
		}),
		api.categories.getMany({
			query: { showAll: true },
			tags: ["categories"],
		}),
	]);

	return (
		<EditPost
			initialData={post}
			topics={topics?.items}
			categories={categories?.items}
			editMode
			user={session?.user}
		/>
	);
}
