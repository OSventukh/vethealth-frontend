import {
	extractLexicalText,
	extractPageBlocksText,
} from "@/lib/content-text";
import type { PageBlock } from "@/lib/page-builder/types";

const lexical = (texts: string[]) =>
	JSON.stringify({
		root: {
			children: texts.map((text) => ({
				children: [{ text }],
			})),
		},
	});

describe("extractLexicalText", () => {
	it("collects text from nested nodes", () => {
		expect(extractLexicalText(lexical(["Перший абзац.", "Другий абзац."]))).toBe(
			"Перший абзац. Другий абзац.",
		);
	});

	it("returns empty string for invalid json", () => {
		expect(extractLexicalText("not-json")).toBe("");
	});

	it("caps output at maxChars", () => {
		const text = extractLexicalText(lexical(["а".repeat(500)]), 100);
		expect(text.length).toBe(100);
	});
});

describe("extractPageBlocksText", () => {
	it("collects strings from blocks, skips urls, unpacks richtext", () => {
		const blocks: PageBlock[] = [
			{
				id: "1",
				type: "hero",
				data: {
					eyebrow: "Про нас",
					title: "Клініка",
					text: "Опис клініки",
					ctaLabel: "Звернутися",
					ctaHref: "/contact",
					imageUrl: "https://example.com/img.png",
					imageAlt: "Фото",
				},
			},
			{
				id: "2",
				type: "richtext",
				data: { content: lexical(["Текст із Lexical"]) },
			},
			{
				id: "3",
				type: "faq",
				data: {
					title: "Питання",
					items: [{ question: "Як?", answer: "Так." }],
				},
			},
		];

		const text = extractPageBlocksText(blocks);
		expect(text).toContain("Клініка");
		expect(text).toContain("Текст із Lexical");
		expect(text).toContain("Так.");
		expect(text).not.toContain("example.com");
		expect(text).not.toContain("/contact");
	});
});
