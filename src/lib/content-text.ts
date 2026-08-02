import type { PageBlock } from "@/lib/page-builder/types";

type LexicalNode = {
	text?: unknown;
	children?: LexicalNode[];
};

/**
 * Повний plain-text із серіалізованого Lexical editor-state — вхід для
 * ШІ-генерації мета-полів (на відміну від extractDescription у (public),
 * який обрізає до 160 символів під meta description).
 */
export function extractLexicalText(content: string, maxChars = 12000): string {
	try {
		const parsed = JSON.parse(content) as { root?: LexicalNode };
		const chunks: string[] = [];
		let length = 0;

		const walk = (node: LexicalNode | undefined) => {
			if (!node || length >= maxChars) {
				return;
			}
			if (typeof node.text === "string" && node.text.trim()) {
				chunks.push(node.text.trim());
				length += node.text.length;
			}
			node.children?.forEach(walk);
		};
		walk(parsed?.root);

		return chunks.join(" ").replaceAll(/\s+/g, " ").trim().slice(0, maxChars);
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
	maxChars = 12000,
): string {
	const chunks: string[] = [];

	const collect = (value: unknown, key?: string) => {
		if (typeof value === "string") {
			if (key && URLISH_KEYS.test(key)) {
				return;
			}
			const text =
				key === "content" ? extractLexicalText(value, maxChars) : value.trim();
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

	return chunks
		.join("\n")
		.replaceAll(/[ \t]+/g, " ")
		.trim()
		.slice(0, maxChars);
}
