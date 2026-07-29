import { ParsedContent } from "@/app/(dashboard)/admin/components/Editor/ParsedContent";
import type { RichTextBlockData } from "@/lib/page-builder/types";

export function RichTextBlock({ data }: { data: RichTextBlockData }) {
	if (!data.content) return null;
	let parsed: unknown;
	try {
		parsed = JSON.parse(data.content);
	} catch {
		return null;
	}
	return (
		<div className="prose prose-headings:text-lg max-w-none">
			<ParsedContent
				content={parsed as { children: unknown[]; root?: unknown }}
			/>
		</div>
	);
}
