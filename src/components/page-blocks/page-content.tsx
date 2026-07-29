import { ParsedContent } from "@/app/(dashboard)/admin/components/Editor/ParsedContent";
import { parsePageDocument } from "@/lib/page-builder/parse";
import { PageBlocks } from "./index";

interface Props {
	content: string | null | undefined;
	/** Класи для легасі-контенту (Lexical), який рендериться через prose. */
	proseClassName?: string;
}

/**
 * Рендерить контент сторінки: документ конструктора — блоками,
 * легасі (Lexical editor-state) — через ParsedContent.
 */
export function PageContent({
	content,
	proseClassName = "prose prose-headings:text-lg max-w-none",
}: Props) {
	if (!content) return null;
	const document = parsePageDocument(content);
	if (document) {
		return <PageBlocks document={document} />;
	}
	let parsed: unknown;
	try {
		parsed = JSON.parse(content);
	} catch {
		return null;
	}
	return (
		<div className={proseClassName}>
			<ParsedContent
				content={parsed as { children: unknown[]; root?: unknown }}
			/>
		</div>
	);
}
