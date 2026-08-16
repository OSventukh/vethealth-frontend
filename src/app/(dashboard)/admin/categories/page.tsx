import { PenSquare } from "lucide-react";
import { Suspense } from "react";
import CreateButton from "@/components/ui/create-button";
import { DataTableSkeleton } from "@/components/ui/DataTable/TableSkeleton";
import {
	type CategoriesSearchParams,
	CategoriesTable,
} from "./categories-table";

type Props = {
	searchParams: Promise<CategoriesSearchParams>;
};

export default function CategoriesPage(props: Props) {
	return (
		<>
			<CreateButton
				link="categories/create"
				icon={<PenSquare size={20} />}
				text="Нова категорія"
			/>

			<Suspense fallback={<DataTableSkeleton columnCount={3} />}>
				<CategoriesTable searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}
