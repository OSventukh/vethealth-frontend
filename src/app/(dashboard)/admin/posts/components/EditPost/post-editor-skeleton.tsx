import { Skeleton } from "@/components/ui/skeleton";

export function PostEditorSkeleton() {
	return (
		<div className="flex w-full max-w-[1400px] flex-col gap-5">
			<div className="flex items-center justify-between gap-3">
				<Skeleton className="h-9 w-64" />
				<Skeleton className="h-9 w-72" />
			</div>
			<div className="flex w-full flex-col items-start gap-5 lg:flex-row">
				<div className="flex w-full min-w-0 flex-1 flex-col gap-4">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-[60dvh] w-full" />
				</div>
				<aside className="flex w-full flex-col gap-4 lg:w-[320px] lg:shrink-0 xl:w-[340px]">
					<Skeleton className="h-40 w-full" />
					<Skeleton className="h-56 w-full" />
					<Skeleton className="h-48 w-full" />
				</aside>
			</div>
		</div>
	);
}
