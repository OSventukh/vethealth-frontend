import { Skeleton } from "@/components/ui/skeleton";

export function TopicEditorSkeleton() {
	return (
		<div className="bg-background mt-5 w-full rounded-2xl border p-10">
			<div className="grid grid-cols-2 gap-8">
				<div className="flex flex-col gap-8">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-24 w-full" />
					<div className="flex flex-wrap gap-4">
						<Skeleton className="h-10 w-[180px]" />
						<Skeleton className="h-10 w-[180px]" />
						<Skeleton className="h-10 w-[180px]" />
					</div>
				</div>
				<Skeleton className="aspect-video w-full" />
				<Skeleton className="col-span-2 h-10 w-40 justify-self-center" />
			</div>
		</div>
	);
}
