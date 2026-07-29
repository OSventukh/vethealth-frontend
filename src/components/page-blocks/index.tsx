import type { PageBlock, PageBuilderDocument } from "@/lib/page-builder/types";
import { ContactsBlock } from "./contacts-block";
import { CtaBlock } from "./cta-block";
import { FaqBlock } from "./faq-block";
import { GalleryBlock } from "./gallery-block";
import { HeadingBlock } from "./heading-block";
import { HeroBlock } from "./hero-block";
import { ImageBlock } from "./image-block";
import { RichTextBlock } from "./richtext-block";
import { ServicesBlock } from "./services-block";
import { StatsBlock } from "./stats-block";
import { TeamBlock } from "./team-block";

export function PageBlockView({ block }: { block: PageBlock }) {
	switch (block.type) {
		case "hero":
			return <HeroBlock data={block.data} />;
		case "heading":
			return <HeadingBlock data={block.data} />;
		case "richtext":
			return <RichTextBlock data={block.data} />;
		case "stats":
			return <StatsBlock data={block.data} />;
		case "services":
			return <ServicesBlock data={block.data} />;
		case "team":
			return <TeamBlock data={block.data} />;
		case "gallery":
			return <GalleryBlock data={block.data} />;
		case "image":
			return <ImageBlock data={block.data} />;
		case "cta":
			return <CtaBlock data={block.data} />;
		case "faq":
			return <FaqBlock data={block.data} />;
		case "contacts":
			return <ContactsBlock data={block.data} />;
		default:
			return null;
	}
}

export function PageBlocks({ document }: { document: PageBuilderDocument }) {
	return (
		<>
			{document.blocks.map((block) => (
				<PageBlockView key={block.id} block={block} />
			))}
		</>
	);
}
