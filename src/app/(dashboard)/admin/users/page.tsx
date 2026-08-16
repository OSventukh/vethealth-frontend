import { UserPlus } from "lucide-react";
import { Suspense } from "react";
import CreateButton from "@/components/ui/create-button";
import { DataTableSkeleton } from "@/components/ui/DataTable/TableSkeleton";
import { type UsersSearchParams, UsersTable } from "./users-table";

type Props = {
	searchParams: Promise<UsersSearchParams>;
};

export default function UsersPage(props: Props) {
	return (
		<>
			<CreateButton
				link="users/create"
				icon={<UserPlus size={20} />}
				text="Новий користувач"
			/>

			<Suspense fallback={<DataTableSkeleton columnCount={6} />}>
				<UsersTable searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}
