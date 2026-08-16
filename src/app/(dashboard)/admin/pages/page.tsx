import { PenSquare } from "lucide-react";
import { Suspense } from "react";
import CreateButton from "@/components/ui/create-button";
import { DataTableSkeleton } from "@/components/ui/DataTable/TableSkeleton";
import { type PagesSearchParams, PagesTable } from "./pages-table";

type Props = {
	searchParams: Promise<PagesSearchParams>;
};

export default function PagesPage(props: Props) {
	return (
		<>
			<CreateButton
				link="pages/create"
				icon={<PenSquare size={20} />}
				text="Нова сторінка"
			/>

			<Suspense fallback={<DataTableSkeleton columnCount={5} />}>
				<PagesTable searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}
