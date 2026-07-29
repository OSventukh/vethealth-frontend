import {
	HelpCircle,
	Image as ImageIcon,
	Images,
	Hash,
	Heading1,
	LayoutGrid,
	LayoutTemplate,
	MapPin,
	Megaphone,
	Pilcrow,
	Users,
} from "lucide-react";
import type { ComponentType } from "react";
import { BLOCK_META } from "@/lib/page-builder/defaults";
import type { PageBlockType } from "@/lib/page-builder/types";

export const BLOCK_ICONS: Record<
	PageBlockType,
	ComponentType<{ className?: string }>
> = {
	hero: LayoutTemplate,
	heading: Heading1,
	richtext: Pilcrow,
	stats: Hash,
	services: LayoutGrid,
	team: Users,
	gallery: Images,
	image: ImageIcon,
	cta: Megaphone,
	faq: HelpCircle,
	contacts: MapPin,
};

export const BLOCK_GROUPS_ORDER = ["Структура", "Текст", "Медіа"] as const;

export function BlockTypeIcon({
	type,
	className,
}: {
	type: PageBlockType;
	className?: string;
}) {
	const Icon = BLOCK_ICONS[type];
	return <Icon className={className} />;
}

export { BLOCK_META };
