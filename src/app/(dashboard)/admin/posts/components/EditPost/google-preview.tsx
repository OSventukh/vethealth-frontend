import { cn } from "@/lib/utils";

type Props = {
	mode: "desktop" | "mobile";
	title: string;
	url: string;
	description: string;
};

export function GooglePreview({ mode, title, url, description }: Props) {
	return (
		<div
			className={cn(
				"max-w-full rounded-xl border border-[#dadce0] bg-white p-4",
				mode === "mobile" ? "w-[360px]" : "w-full",
			)}
		>
			<div className="mb-2 flex items-center gap-2.5">
				<span className="from-primary flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br to-orange-400 text-[11px] font-bold text-white">
					V
				</span>
				<div className="leading-tight">
					<div className="text-[13px] font-semibold text-[#202124]">
						VetHealth
					</div>
					<div className="text-[11px] text-[#5f6368]">{url}</div>
				</div>
			</div>
			<div className="mb-1 font-sans text-lg leading-snug font-medium text-[#1a0dab]">
				{title.length > 60 ? `${title.slice(0, 60)}…` : title}
			</div>
			<div className="font-sans text-[13px] leading-normal text-[#4d5156]">
				{description.length > 160
					? `${description.slice(0, 160)}…`
					: description}
			</div>
		</div>
	);
}
