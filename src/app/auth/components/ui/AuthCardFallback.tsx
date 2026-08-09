import { Skeleton } from "@/components/ui/skeleton";
import AuthCard from "./AuthCard";

export default function AuthCardFallback() {
	return (
		<AuthCard>
			<div className="min-h-14 w-full" />
			<div className="flex flex-col gap-2 sm:gap-4">
				<div className="space-y-2">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-10 w-full" />
					<div className="h-2" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-10 w-full" />
					<div className="h-2" />
				</div>
				<div className="flex justify-center">
					<Skeleton className="h-10 w-28" />
				</div>
			</div>
		</AuthCard>
	);
}
