import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { raleway } from "@/lib/fonts";
import type { FaqBlockData } from "@/lib/page-builder/types";

export function FaqBlock({ data }: { data: FaqBlockData }) {
	if (!data.items.length) return null;
	return (
		<section className="mx-auto max-w-3xl py-10">
			{data.title && (
				<h2
					className={`${raleway.className} mb-6 text-center text-2xl font-bold md:text-3xl`}
				>
					{data.title}
				</h2>
			)}
			<Accordion type="single" collapsible>
				{data.items.map((item, i) => (
					<AccordionItem key={`faq-${i}`} value={`faq-${i}`}>
						<AccordionTrigger className="text-left text-base font-semibold">
							{item.question}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground text-base leading-relaxed">
							{item.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}
