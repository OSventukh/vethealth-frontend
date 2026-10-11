import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import {
	generateEntrySeoAction,
	saveEntrySeoAction,
} from "@/app/(dashboard)/admin/seo/actions/seo.action";
import { SeoWorkspace } from "@/app/(dashboard)/admin/seo/components/seo-workspace";
import { buildSeoEntries } from "@/app/(dashboard)/admin/seo/seo-fields";

jest.mock("../src/app/(dashboard)/admin/seo/actions/seo.action", () => ({
	generateEntrySeoAction: jest.fn(),
	saveEntrySeoAction: jest.fn(),
}));
const toast = jest.fn();
jest.mock("../src/components/ui/use-toast", () => ({
	useToast: () => ({ toast }),
}));

const generateMock = generateEntrySeoAction as jest.Mock;
const saveMock = saveEntrySeoAction as jest.Mock;

const SAVED = {
	metaTitle: "Бабезіоз у собак: симптоми і лікування",
	metaDescription: "Старий опис",
	metaKeywords: null,
	ogTitle: "OG старий",
	ogDescription: null,
};

const entries = buildSeoEntries([
	{
		type: "post",
		id: "p1",
		title: "Бабезіоз",
		slug: "babesiosis",
		status: "Published",
		topicSlugs: [],
		metadata: SAVED,
	},
]);

const field = (label: string) =>
	screen.getByLabelText(new RegExp(`^${label}`)) as HTMLInputElement;

describe("SeoWorkspace", () => {
	beforeEach(() => {
		localStorage.clear();
		generateMock.mockReset();
		saveMock.mockReset();
		toast.mockReset();
		render(<SeoWorkspace initialEntries={entries} />);
		fireEvent.click(screen.getByRole("button", { name: /Бабезіоз/ }));
	});

	it("regenerates a single field with the editor's hint and current values", async () => {
		generateMock.mockResolvedValue({
			success: true,
			data: { metaDescription: "Новий опис від ШІ" },
			warnings: ["Перевірте довжину опису"],
		});
		fireEvent.change(screen.getByLabelText(/Головний пошуковий запит/), {
			target: { value: "бабезіоз у собак" },
		});
		fireEvent.change(screen.getByPlaceholderText(/Побажання для ШІ/), {
			target: { value: "згадай кліщів" },
		});

		const descriptionBlock = field("Meta description").closest(
			"div.flex-col",
		) as HTMLElement;
		fireEvent.click(
			within(descriptionBlock).getByTitle("Перегенерувати це поле з ШІ"),
		);

		await waitFor(() =>
			expect(field("Meta description")).toHaveValue("Новий опис від ШІ"),
		);
		expect(generateMock).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "post",
				id: "p1",
				fields: ["metaDescription"],
				hint: "згадай кліщів",
				primaryKeyword: "бабезіоз у собак",
				current: expect.objectContaining({ metaTitle: SAVED.metaTitle }),
			}),
		);
		expect(screen.getByRole("status")).toHaveTextContent(
			"Перевірте довжину опису",
		);
		// інші поля не зачеплені
		expect(field("Meta title")).toHaveValue(SAVED.metaTitle);
		expect(screen.getByText("Не збережено: 1")).toBeInTheDocument();
	});

	it("saves only the changed fields after manual edits", async () => {
		saveMock.mockResolvedValue({
			success: true,
			data: { ...SAVED, ogTitle: "OG новий" },
		});

		fireEvent.change(field("OG title"), { target: { value: "OG новий" } });
		expect(screen.getByText(/Збережено:/)).toHaveTextContent("OG старий");
		fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));

		await waitFor(() =>
			expect(saveMock).toHaveBeenCalledWith({
				type: "post",
				id: "p1",
				values: { ogTitle: "OG новий" },
			}),
		);
		await waitFor(() =>
			expect(screen.queryByText(/Не збережено/)).not.toBeInTheDocument(),
		);
	});

	it("reverts a field to the saved value", () => {
		fireEvent.change(field("Meta title"), { target: { value: "Інший" } });
		fireEvent.click(screen.getByTitle("Повернути збережене значення"));

		expect(field("Meta title")).toHaveValue(SAVED.metaTitle);
		expect(screen.queryByText(/Не збережено/)).not.toBeInTheDocument();
	});

	it("keeps unsaved edits in localStorage", async () => {
		fireEvent.change(field("Ключові слова"), {
			target: { value: "бабезіоз, кліщі" },
		});

		await waitFor(() =>
			expect(
				JSON.parse(localStorage.getItem("vethealth:seo-drafts") ?? "{}"),
			).toEqual({ "post:p1": { metaKeywords: "бабезіоз, кліщі" } }),
		);
	});
});
