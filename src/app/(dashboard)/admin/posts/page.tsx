import { PenSquare } from "lucide-react";
import { Suspense } from "react";
import CreateButton from "@/components/ui/create-button";
import { DataTableSkeleton } from "@/components/ui/DataTable/TableSkeleton";
import { type PostsSearchParams, PostsTable } from "./posts-table";

type Props = {
	searchParams: Promise<PostsSearchParams>;
};

export default function PostsPage(props: Props) {
	return (
		<>
			<CreateButton
				link="posts/create"
				icon={<PenSquare size={20} />}
				text="Нова стаття"
			/>

			<Suspense fallback={<DataTableSkeleton columnCount={5} />}>
				<PostsTable searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}
