import { Skeleton } from "@/components/ui/skeleton";

type Props = {
	columnCount: number;
	rowCount?: number;
};

export function DataTableSkeleton({ columnCount, rowCount = 10 }: Props) {
	const columns = Array.from({ length: columnCount }, (_, index) => index);
	const rows = Array.from({ length: rowCount }, (_, index) => index);
	const gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;

	return (
		<div className="bg-background mt-5 flex w-full flex-col gap-5 rounded-2xl border p-4 md:p-10">
			<div className="flex">
				<Skeleton className="h-10 w-full max-w-sm rounded-xl" />
			</div>

			<div className="w-full rounded-xl border">
				<div
					className="grid h-12 items-center gap-4 border-b px-4"
					style={{ gridTemplateColumns }}
				>
					{columns.map((column) => (
						<Skeleton key={column} className="h-4" />
					))}
				</div>
				{rows.map((row) => (
					<div
						key={row}
						className="grid h-[53px] items-center gap-4 border-b px-4 last:border-0"
						style={{ gridTemplateColumns }}
					>
						{columns.map((column) => (
							<Skeleton key={column} className="h-4" />
						))}
					</div>
				))}
			</div>

			<div className="flex w-full items-center justify-between md:px-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-8 w-56" />
			</div>
		</div>
	);
}
