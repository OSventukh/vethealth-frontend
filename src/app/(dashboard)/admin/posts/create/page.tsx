import { api } from "@/api";
import { auth } from "@/lib/next-auth/auth";
import EditPost from "../components/EditPost";

export default async function CreatPage() {
	const [session, topics, categories] = await Promise.all([
		auth(),
		api.topics.getMany({}),
		api.categories.getMany({}),
	]);

	return (
		<EditPost
			topics={topics?.items || []}
			categories={categories?.items || []}
			user={session?.user}
		/>
	);
}
