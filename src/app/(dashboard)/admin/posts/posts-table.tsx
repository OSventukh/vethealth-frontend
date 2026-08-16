import { api } from "@/api";
import { DataTable } from "@/components/ui/DataTable";
import { postQuerySchema } from "@/utils/validators/query.validator";
import { postColumns } from "./columns";

export type PostsSearchParams = {
	page?: string;
	size?: string;
	sort?: string;
	orderBy?: string;
	title?: string;
	status?: string;
};

type Props = {
	searchParams: Promise<PostsSearchParams>;
};

export async function PostsTable({ searchParams }: Props) {
	const postQueryValidation = postQuerySchema.safeParse(await searchParams);
	const posts = await api.posts.getMany({
		query: {
			status: "all",
			...(postQueryValidation.success ? postQueryValidation.data : undefined),
		},
		tags: ["posts"],
	});

	return (
		<DataTable
			columns={postColumns}
			data={posts?.items || []}
			pageCount={posts?.totalPages || 0}
			searchField="title"
		/>
	);
}
