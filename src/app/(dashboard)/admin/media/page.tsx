import { Suspense } from "react";
import { listMediaAction } from "@/actions/media.action";
import { DataTableSkeleton } from "@/components/ui/DataTable/TableSkeleton";
import { MediaWorkspace } from "./components/media-workspace";

export default function MediaPage() {
	return (
		<Suspense fallback={<DataTableSkeleton columnCount={4} />}>
			<MediaContent />
		</Suspense>
	);
}

async function MediaContent() {
	const result = await listMediaAction({ page: 1, size: 40 });
	if (!result.success) {
		return <p className="text-destructive p-6">{result.message}</p>;
	}
	// Права (Admin+ — alt, ШІ, видалення) — з MediaPermissionsProvider у layout.
	return <MediaWorkspace initial={result.data} />;
}
