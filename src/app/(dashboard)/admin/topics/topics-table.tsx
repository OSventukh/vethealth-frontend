import { api } from "@/api";
import { DataTable } from "@/components/ui/DataTable";
import { topicQuerySchema } from "@/utils/validators/query.validator";
import { topicColumns } from "./columns";

export type TopicsSearchParams = {
	page?: string;
	size?: string;
	sort?: string;
	orderBy?: string;
	title?: string;
};

type Props = {
	searchParams: Promise<TopicsSearchParams>;
};

export async function TopicsTable({ searchParams }: Props) {
	const topicQueryValidation = topicQuerySchema.safeParse({
		...(await searchParams),
		include: "children",
	});
	const topics = await api.topics.getMany({
		query: topicQueryValidation.success ? topicQueryValidation.data : undefined,
		tags: ["topics"],
	});

	return (
		<DataTable
			columns={topicColumns}
			data={topics?.items || []}
			pageCount={topics?.totalPages || 0}
			searchField="title"
			childrenProp="children"
		/>
	);
}
