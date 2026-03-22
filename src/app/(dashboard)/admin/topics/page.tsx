import { PenSquare } from "lucide-react";
import { api } from "@/api";
import CreateButton from "@/components/ui/create-button";
import { DataTable } from "@/components/ui/DataTable";
import { topicQuerySchema } from "@/utils/validators/query.validator";
import { topicColumns } from "./columns";

type Props = {
	searchParams: Promise<{
		page?: string;
		size?: string;
		sort?: string;
		orderBy?: string;
		title?: string;
	}>;
};

export default async function TopicsPage(props: Props) {
	const searchParams = await props.searchParams;
	const topicQueryValidation = topicQuerySchema.safeParse({
		...searchParams,
		include: "children",
	});
	const topics = await api.topics.getMany({
		query: topicQueryValidation.success ? topicQueryValidation.data : undefined,
		tags: ["topics"],
	});

	return (
		<>
			<CreateButton
				link="topics/create"
				icon={<PenSquare size={20} />}
				text="Нова тема"
			/>
			<DataTable
				columns={topicColumns}
				data={topics?.items || []}
				pageCount={topics?.totalPages || 0}
				searchField="title"
				childrenProp="children"
			/>
		</>
	);
}
