import { PenSquare } from "lucide-react";
import { Suspense } from "react";
import CreateButton from "@/components/ui/create-button";
import { DataTableSkeleton } from "@/components/ui/DataTable/TableSkeleton";
import { type TopicsSearchParams, TopicsTable } from "./topics-table";

type Props = {
	searchParams: Promise<TopicsSearchParams>;
};

export default function TopicsPage(props: Props) {
	return (
		<>
			<CreateButton
				link="topics/create"
				icon={<PenSquare size={20} />}
				text="Нова тема"
			/>

			<Suspense fallback={<DataTableSkeleton columnCount={5} />}>
				<TopicsTable searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}
