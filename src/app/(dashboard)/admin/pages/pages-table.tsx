import { api } from "@/api";
import { DataTable } from "@/components/ui/DataTable";
import { postQuerySchema } from "@/utils/validators/query.validator";
import { pageColumns } from "./columns";

export type PagesSearchParams = {
	page?: string;
	size?: string;
	sort?: string;
	orderBy?: string;
	title?: string;
};

type Props = {
	searchParams: Promise<PagesSearchParams>;
};

export async function PagesTable({ searchParams }: Props) {
	const postQueryValidation = postQuerySchema.safeParse(await searchParams);
	const pages = await api.pages.getMany({
		query: postQueryValidation.success ? postQueryValidation.data : undefined,
		tags: ["pages"],
	});

	return (
		<DataTable
			columns={pageColumns}
			data={pages?.items || []}
			pageCount={pages?.totalPages || 1}
			searchField="title"
		/>
	);
}
