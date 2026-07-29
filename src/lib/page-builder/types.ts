export interface StatItem {
	value: string;
	label: string;
}

export interface ServiceItem {
	title: string;
	description: string;
}

export interface TeamMember {
	name: string;
	role: string;
	photoUrl: string;
}

export interface GalleryImage {
	url: string;
	alt: string;
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface HeroBlockData {
	eyebrow: string;
	title: string;
	text: string;
	ctaLabel: string;
	ctaHref: string;
	imageUrl: string;
	imageAlt: string;
}

export interface HeadingBlockData {
	text: string;
}

/**
 * Блок з довільним rich-text контентом. `content` — серіалізований
 * editor-state Lexical (той самий формат, що раніше займав усю сторінку).
 */
export interface RichTextBlockData {
	content: string;
}

export interface StatsBlockData {
	items: StatItem[];
}

export interface ServicesBlockData {
	title: string;
	cols: 2 | 3 | 4;
	items: ServiceItem[];
}

export interface TeamBlockData {
	title: string;
	members: TeamMember[];
}

export interface GalleryBlockData {
	images: GalleryImage[];
}

export interface ImageBlockData {
	url: string;
	alt: string;
	caption: string;
}

export interface CtaBlockData {
	title: string;
	text: string;
	btnLabel: string;
	btnHref: string;
}

export interface FaqBlockData {
	title: string;
	items: FaqItem[];
}

export interface ContactsBlockData {
	title: string;
	address: string;
	phone: string;
	email: string;
	schedule: string;
}

export interface PageBlockDataMap {
	hero: HeroBlockData;
	heading: HeadingBlockData;
	richtext: RichTextBlockData;
	stats: StatsBlockData;
	services: ServicesBlockData;
	team: TeamBlockData;
	gallery: GalleryBlockData;
	image: ImageBlockData;
	cta: CtaBlockData;
	faq: FaqBlockData;
	contacts: ContactsBlockData;
}

export type PageBlockType = keyof PageBlockDataMap;

export type PageBlock = {
	[T in PageBlockType]: {
		id: string;
		type: T;
		data: PageBlockDataMap[T];
	};
}[PageBlockType];

export const PAGE_DOCUMENT_VERSION = 1;

export interface PageBuilderDocument {
	version: typeof PAGE_DOCUMENT_VERSION;
	blocks: PageBlock[];
}
