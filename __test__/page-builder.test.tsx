/**
 * Модель документа конструктора сторінок: розпізнавання builder-JSON проти
 * легасі Lexical editor-state (обидва живуть у тому самому полі
 * `pages.content`), загортання легасі в richtext-блок і рендеринг блоків.
 */
import { render, screen } from "@testing-library/react";
import { PageBlocks } from "@/components/page-blocks";
import { PageContent } from "@/components/page-blocks/page-content";
import { createDefaultBlockData } from "@/lib/page-builder/defaults";
import {
	createDocumentFromLegacy,
	parsePageDocument,
	serializePageDocument,
} from "@/lib/page-builder/parse";
import type { PageBuilderDocument } from "@/lib/page-builder/types";

const LEXICAL_CONTENT = JSON.stringify({
	root: {
		children: [
			{
				type: "paragraph",
				children: [{ type: "text", text: "Легасі-текст сторінки", format: 0 }],
			},
		],
	},
});

describe("parsePageDocument", () => {
	it("розпізнає документ конструктора", () => {
		const document: PageBuilderDocument = {
			version: 1,
			blocks: [
				{ id: "b1", type: "heading", data: { text: "Заголовок" } },
			],
		};
		expect(parsePageDocument(serializePageDocument(document))).toEqual(
			document,
		);
	});

	it("повертає null для легасі Lexical-контенту", () => {
		expect(parsePageDocument(LEXICAL_CONTENT)).toBeNull();
	});

	it("повертає null для порожнього і невалідного контенту", () => {
		expect(parsePageDocument("")).toBeNull();
		expect(parsePageDocument(null)).toBeNull();
		expect(parsePageDocument("not json")).toBeNull();
	});
});

describe("createDocumentFromLegacy", () => {
	it("загортає легасі-контент у єдиний richtext-блок", () => {
		const document = createDocumentFromLegacy(LEXICAL_CONTENT);
		expect(document.version).toBe(1);
		expect(document.blocks).toHaveLength(1);
		expect(document.blocks[0].type).toBe("richtext");
		expect(document.blocks[0].data).toEqual({ content: LEXICAL_CONTENT });
	});
});

describe("PageBlocks", () => {
	it("рендерить блоки за типами", () => {
		const document: PageBuilderDocument = {
			version: 1,
			blocks: [
				{
					id: "b1",
					type: "hero",
					data: {
						...createDefaultBlockData("hero"),
						title: "Турбота про улюбленців",
						ctaLabel: "Записатися",
					},
				},
				{
					id: "b2",
					type: "stats",
					data: { items: [{ value: "24/7", label: "допомога" }] },
				},
				{
					id: "b3",
					type: "faq",
					data: {
						title: "Часті запитання",
						items: [{ question: "Як записатися?", answer: "Телефонуйте." }],
					},
				},
			],
		};
		render(<PageBlocks document={document} />);
		expect(screen.getByText("Турбота про улюбленців")).toBeTruthy();
		expect(screen.getByText("24/7")).toBeTruthy();
		expect(screen.getByText("Як записатися?")).toBeTruthy();
	});
});

describe("PageContent", () => {
	it("рендерить легасі-контент через ParsedContent", () => {
		render(<PageContent content={LEXICAL_CONTENT} />);
		expect(screen.getByText("Легасі-текст сторінки")).toBeTruthy();
	});

	it("рендерить документ конструктора блоками", () => {
		const document: PageBuilderDocument = {
			version: 1,
			blocks: [
				{ id: "b1", type: "heading", data: { text: "Блочний заголовок" } },
			],
		};
		render(<PageContent content={serializePageDocument(document)} />);
		expect(screen.getByText("Блочний заголовок")).toBeTruthy();
	});

	it("не падає на порожньому та битому контенті", () => {
		const { container } = render(<PageContent content="" />);
		expect(container.innerHTML).toBe("");
		render(<PageContent content="{broken" />);
	});
});

describe("нейтралізація javascript:-URL", () => {
	it("cta-блок рендерить небезпечний href як текст без лінка", () => {
		const document: PageBuilderDocument = {
			version: 1,
			blocks: [
				{
					id: "b1",
					type: "cta",
					data: {
						title: "CTA",
						text: "",
						// eslint-disable-next-line no-script-url
						btnHref: "javascript:alert(1)",
						btnLabel: "Клікни",
					},
				},
			],
		};
		const { container } = render(<PageBlocks document={document} />);
		expect(screen.getByText("Клікни").tagName).toBe("SPAN");
		expect(container.querySelector("a")).toBeNull();
	});

	it("легасі Lexical-лінк з небезпечним URL рендериться без <a>", () => {
		const legacy = JSON.stringify({
			root: {
				children: [
					{
						type: "paragraph",
						children: [
							{
								type: "link",
								// eslint-disable-next-line no-script-url
								url: "javascript:alert(1)",
								children: [{ type: "text", text: "Небезпечний лінк" }],
							},
						],
					},
				],
			},
		});
		const { container } = render(<PageContent content={legacy} />);
		expect(screen.getByText("Небезпечний лінк")).toBeTruthy();
		expect(container.querySelector("a")).toBeNull();
	});

	it("https-лінк лишається справжнім <a>", () => {
		const document: PageBuilderDocument = {
			version: 1,
			blocks: [
				{
					id: "b1",
					type: "cta",
					data: {
						title: "CTA",
						text: "",
						btnHref: "https://vethealth.com.ua",
						btnLabel: "Сайт",
					},
				},
			],
		};
		const { container } = render(<PageBlocks document={document} />);
		const link = container.querySelector("a");
		expect(link?.getAttribute("href")).toBe("https://vethealth.com.ua");
	});
});
