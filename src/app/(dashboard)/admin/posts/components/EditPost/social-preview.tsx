import { SITE_HOST } from "@/utils/constants/generals";

type Props = {
	mode: "facebook" | "twitter";
	title: string;
	description: string;
	image?: string;
};

function ImagePlaceholder() {
	return (
		<div className="from-primary to-primary/60 relative flex h-full w-full items-center justify-center bg-gradient-to-br">
			<div
				className="absolute inset-0"
				style={{
					background:
						"repeating-linear-gradient(45deg, rgba(255,255,255,.08) 0 14px, transparent 14px 28px)",
				}}
			/>
			<span className="font-mono text-xs tracking-wider text-white/70">
				[ og-image · 1200×630 ]
			</span>
		</div>
	);
}

export function SocialPreview({ mode, title, description, image }: Props) {
	if (mode === "twitter") {
		return (
			<div className="max-w-[520px] overflow-hidden rounded-2xl border border-[#cfd9de] bg-white">
				<div
					className="aspect-[2/1] bg-cover bg-center"
					style={image ? { backgroundImage: `url(${image})` } : undefined}
				>
					{!image && <ImagePlaceholder />}
				</div>
				<div className="border-t border-[#eff3f4] px-3.5 py-2.5">
					<div className="text-[11px] text-[#536471]">{SITE_HOST}</div>
					<div className="mt-0.5 text-[15px] leading-snug font-semibold text-[#0f1419]">
						{title}
					</div>
					<div className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#536471]">
						{description}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-[520px] overflow-hidden rounded-lg border border-[#dddfe2] bg-[#F0F2F5]">
			<div
				className="aspect-[1.91/1] bg-cover bg-center"
				style={image ? { backgroundImage: `url(${image})` } : undefined}
			>
				{!image && <ImagePlaceholder />}
			</div>
			<div className="px-3.5 py-2.5">
				<div className="text-xs tracking-wide text-[#65676B] uppercase">
					{SITE_HOST}
				</div>
				<div className="mt-1 text-base leading-snug font-semibold text-[#1c1e21]">
					{title}
				</div>
				<div className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#65676B]">
					{description}
				</div>
			</div>
		</div>
	);
}
