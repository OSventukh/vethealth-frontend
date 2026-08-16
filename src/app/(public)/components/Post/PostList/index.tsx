import { notFound } from "next/navigation";
import { api } from "@/api";
import NotFound from "@/components/public/NotFound/NotFound";
import PostItem from "../PostItem";
import PaginationNav from "./PaginationNav";

type Props = {
	topic: string;
	category?: string;
	page?: number;
};
export default async function PostList({ topic, category, page = 1 }: Props) {
	const posts = await api.posts.getMany({
		query: { topic, category, page },
		tags: ["posts"],
	});

	if (!posts) return notFound();

	return (
		<>
			{posts?.count > 0 && (
				<>
					<div className="grid gap-8 md:grid-cols-2">
						{posts?.items.map((post, index) => (
							<PostItem
								key={post.id}
								post={post}
								topic={topic}
								imagePriority={index < 2}
							/>
						))}
					</div>
					<PaginationNav
						currentPage={posts.currentPage}
						totalPages={posts.totalPages}
						basePath={`/${topic}`}
						category={category}
					/>
				</>
			)}
			{posts?.count === 0 && <NotFound text="Інформація поки-що відсутня" />}
		</>
	);
}
