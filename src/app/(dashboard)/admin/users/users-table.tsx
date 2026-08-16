import { api } from "@/api";
import { DataTable } from "@/components/ui/DataTable";
import { auth } from "@/lib/session/auth";
import { userQuerySchema } from "@/utils/validators/query.validator";
import { userColumns } from "./columns";

export type UsersSearchParams = {
	page?: string;
	size?: string;
	sort?: string;
	orderBy?: string;
	title?: string;
};

type Props = {
	searchParams: Promise<UsersSearchParams>;
};

export async function UsersTable({ searchParams }: Props) {
	const userQueryValidation = userQuerySchema.safeParse(await searchParams);
	const session = await auth();

	const users = await api.users.getMany({
		query: userQueryValidation.success ? userQueryValidation.data : undefined,
		token: session?.token,
		tags: ["users"],
	});

	return (
		<DataTable
			columns={userColumns}
			data={users?.items || []}
			pageCount={users?.totalPages || 1}
			searchField="firstname"
		/>
	);
}
