import { UserPlus } from "lucide-react";
import { api } from "@/api";
import CreateButton from "@/components/ui/create-button";
import { DataTable } from "@/components/ui/DataTable";
import { auth } from "@/lib/next-auth/auth";
import { userQuerySchema } from "@/utils/validators/query.validator";
import { userColumns } from "./columns";

type Props = {
	searchParams: Promise<{
		page?: string;
		size?: string;
		sort?: string;
		orderBy?: string;
		title?: string;
	}>;
};

export default async function UsersPage(props: Props) {
	const searchParams = await props.searchParams;
	const userQueryValidation = userQuerySchema.safeParse(searchParams);
	const session = await auth();

	const users = await api.users.getMany({
		query: userQueryValidation.success ? userQueryValidation.data : undefined,
		token: session?.token,
		tags: ["users"],
	});
	return (
		<>
			<CreateButton
				link="users/create"
				icon={<UserPlus size={20} />}
				text="Новий користувач"
			/>

			<DataTable
				columns={userColumns}
				data={users?.items || []}
				pageCount={users?.totalPages || 1}
				searchField="firstname"
			/>
		</>
	);
}
