import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
	children: React.ReactNode;
	// Omitted by AuthCardFallback: which form is shown depends on request data,
	// so the prerendered shell can't know the title yet.
	title?: string;
};

export default function AuthCard({ children, title }: Props) {
	return (
		<div className="flex h-dvh w-full items-center justify-center bg-blue-50">
			<div className="bg-background flex h-min w-[90%] overflow-hidden rounded-lg sm:w-[40rem] md:w-[45rem]">
				<div className="sm-[50%] flex flex-1 h-full w-full flex-col justify-between p-5">
					<div className="flex w-full flex-col items-center gap-2">
						<Image
							src="/logo/logo.svg"
							alt="logo"
							width={500}
							height={500}
							className="w-12"
							loading="eager"
						/>
						{title ? (
							<h1 className="text-xl font-light uppercase">{title}</h1>
						) : (
							<Skeleton className="h-7 w-48" />
						)}
					</div>
					{children}
				</div>

				<Image
					src="/images/login_image.svg"
					alt="login image"
					width={1000}
					height={1000}
					style={{ objectFit: "contain" }}
					className="flex-1 hidden w-[50%] sm:block"
				/>
			</div>
		</div>
	);
}
