import type { PageBlock } from "@/lib/page-builder/types";

import { lexicalText } from "./seo-content-context";

/** No implicit truncation: the SEO context sampler needs the whole document. */
export function extractLexicalText(
	content: string,
	maxChars = Number.MAX_SAFE_INTEGER,
	structured = false,
): string {
	try {
		return lexicalText(JSON.parse(content), structured).slice(0, maxChars);
	} catch {
		return "";
	}
}

/** Ключі з URL/файлами — не текст, у промт не потрібні. */
const URLISH_KEYS = /url|href|image|photo|src/i;

/**
 * Plain-text з документа конструктора сторінок: рекурсивно збирає всі
 * рядкові поля блоків (щоб нові типи блоків працювали без правок тут),
 * пропускає URL-подібні ключі і розпаковує Lexical у richtext-блоках.
 */
export function extractPageBlocksText(
	blocks: PageBlock[],
	maxChars = Number.MAX_SAFE_INTEGER,
	structured = false,
): string {
	const chunks: string[] = [];

	const collect = (value: unknown, key?: string) => {
		if (typeof value === "string") {
			if (key && URLISH_KEYS.test(key)) {
				return;
			}
			const text =
				key === "content"
					? extractLexicalText(value, maxChars, structured)
					: value.trim();
			if (text) {
				chunks.push(text);
			}
			return;
		}
		if (Array.isArray(value)) {
			for (const item of value) {
				collect(item);
			}
			return;
		}
		if (value && typeof value === "object") {
			for (const [childKey, childValue] of Object.entries(value)) {
				collect(childValue, childKey);
			}
		}
	};

	for (const block of blocks) {
		collect(block.data);
	}

	// Mirrors the backend pageBlocksText: blank line between blocks when structured.
	const text = structured
		? chunks.join("\n\n")
		: chunks.join(" ").replaceAll(/\s+/g, " ");
	return text.trim().slice(0, maxChars);
}
