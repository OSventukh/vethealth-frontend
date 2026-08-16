import { api } from "@/api";
import { DataTable } from "@/components/ui/DataTable";
import { categoryQuerySchema } from "@/utils/validators/query.validator";
import { categoryColumns } from "./columns";

export type CategoriesSearchParams = {
	page?: string;
	size?: string;
	sort?: string;
	orderBy?: string;
	name?: string;
};

type Props = {
	searchParams: Promise<CategoriesSearchParams>;
};

export async function CategoriesTable({ searchParams }: Props) {
	const categoryQueryValidation = categoryQuerySchema.safeParse({
		...(await searchParams),
		include: "children",
	});
	const categories = await api.categories.getMany({
		query: categoryQueryValidation.success
			? categoryQueryValidation.data
			: undefined,
		tags: ["categories"],
	});

	return (
		<DataTable
			columns={categoryColumns}
			data={categories?.items || []}
			pageCount={categories?.totalPages || 1}
			searchField="name"
			childrenProp={"children"}
		/>
	);
}
