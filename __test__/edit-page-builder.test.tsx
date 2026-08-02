/**
 * Smoke test конструктора сторінок: легасі-контент має відкриватися як один
 * richtext-блок, пікер додає нові блоки, SEO-таб показує метадані,
 * панель публікації присутня завжди.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditPage from "@/app/(dashboard)/admin/pages/components";
import type { PageResponse } from "@/api/types/pages.type";

jest.mock("../src/actions/image-upload.action", () => ({
	imageUploadAction: jest.fn(),
}));
jest.mock(
	"../src/app/(dashboard)/admin/pages/actions/save-page.action",
	() => ({
		savePageAction: jest.fn().mockResolvedValue({
			success: true,
			error: false,
			message: "Success",
		}),
	}),
);
jest.mock("../src/app/(dashboard)/admin/actions/generate-seo.action", () => ({
	generateSeoAction: jest.fn().mockResolvedValue({ success: true }),
}));
jest.mock("next/navigation", () => ({
	useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

const LEGACY_CONTENT = JSON.stringify({
	root: {
		children: [
			{
				type: "paragraph",
				children: [{ type: "text", text: "Легасі текст", format: 0 }],
			},
		],
		type: "root",
	},
});

const page: PageResponse = {
	id: "page-1",
	title: "Про клініку",
	content: LEGACY_CONTENT,
	slug: "about",
	featuredImage: null,
	createdAt: "2026-01-01",
	status: "Draft",
	metadata: {
		id: "meta-1",
		metaTitle: "Мета заголовок",
		metaDescription: null,
		metaKeywords: null,
		ogImage: null,
		canonicalUrl: null,
		indexable: true,
		followable: true,
	},
};

describe("EditPage (конструктор сторінок)", () => {
	it("відкриває легасі-сторінку як один richtext-блок", () => {
		render(<EditPage initialData={page} editMode />);
		expect(screen.getByText("Структура")).toBeInTheDocument();
		expect(screen.getAllByText("Текстовий блок").length).toBeGreaterThan(0);
		expect(screen.getByText("Опублікувати сторінку")).toBeInTheDocument();
		expect(screen.getByText("Зберегти чернетку")).toBeInTheDocument();
	});

	it("додає блок через пікер секцій", () => {
		render(<EditPage initialData={page} editMode />);
		// кнопка є і в тулбарі, і в постійному інсерт-барі внизу канвасу
		fireEvent.click(screen.getAllByText("Додати секцію")[0]);
		expect(screen.getByText("Оберіть тип блоку для вашої сторінки")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Показники"));
		// блок з'явився в структурі, пікер закрився
		expect(screen.getAllByText("Показники").length).toBeGreaterThan(0);
		expect(
			screen.queryByText("Оберіть тип блоку для вашої сторінки"),
		).not.toBeInTheDocument();
	});

	it("показує SEO-таб з метаданими", () => {
		render(<EditPage initialData={page} editMode />);
		fireEvent.click(screen.getByText("SEO та метадані"));
		expect(screen.getByText("Превʼю в Google")).toBeInTheDocument();
		expect(screen.getByDisplayValue("Мета заголовок")).toBeInTheDocument();
		expect(screen.getByText("Індексація")).toBeInTheDocument();
	});
});
