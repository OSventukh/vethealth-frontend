import {
	PAGE_DOCUMENT_VERSION,
	type PageBlock,
	type PageBuilderDocument,
} from "./types";

export function createBlockId(): string {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}
	return `b-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isPageBlock(value: unknown): value is PageBlock {
	if (typeof value !== "object" || value === null) return false;
	const block = value as Record<string, unknown>;
	return (
		typeof block.id === "string" &&
		typeof block.type === "string" &&
		typeof block.data === "object" &&
		block.data !== null
	);
}

/**
 * Розбирає `pages.content`. Повертає документ конструктора або `null`,
 * якщо контент — легасі (серіалізований Lexical editor-state) чи невалідний.
 */
export function parsePageDocument(
	content: string | null | undefined,
): PageBuilderDocument | null {
	if (!content) return null;
	let parsed: unknown;
	try {
		parsed = JSON.parse(content);
	} catch {
		return null;
	}
	if (typeof parsed !== "object" || parsed === null) return null;
	const doc = parsed as Record<string, unknown>;
	if (doc.version !== PAGE_DOCUMENT_VERSION || !Array.isArray(doc.blocks)) {
		return null;
	}
	if (!doc.blocks.every(isPageBlock)) return null;
	return { version: PAGE_DOCUMENT_VERSION, blocks: doc.blocks as PageBlock[] };
}

/**
 * Загортає легасі-контент сторінки (Lexical editor-state JSON) в документ
 * конструктора з єдиним richtext-блоком.
 */
export function createDocumentFromLegacy(
	lexicalContent: string,
): PageBuilderDocument {
	return {
		version: PAGE_DOCUMENT_VERSION,
		blocks: [
			{
				id: createBlockId(),
				type: "richtext",
				data: { content: lexicalContent },
			},
		],
	};
}

export function createEmptyDocument(): PageBuilderDocument {
	return { version: PAGE_DOCUMENT_VERSION, blocks: [] };
}

export function serializePageDocument(document: PageBuilderDocument): string {
	return JSON.stringify(document);
}
