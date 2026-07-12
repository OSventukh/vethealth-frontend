import { api } from "@/api";
import { auth } from "@/lib/session/auth";
import EditPost from "../components/EditPost";

export default async function CreatPage() {
	const [session, topics, categories] = await Promise.all([
		auth(),
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
			topics={topics?.items || []}
			categories={categories?.items || []}
			user={session?.user}
		/>
	);
}
