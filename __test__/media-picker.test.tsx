import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MediaPermissionsProvider } from "@/components/media-library/media-permissions";
import { MediaPickerPanel } from "@/components/media-library/media-picker";

const asAdmin = {
	wrapper: ({ children }: { children: React.ReactNode }) => (
		<MediaPermissionsProvider canManage>{children}</MediaPermissionsProvider>
	),
};

const listMock = jest.fn();
const updateMock = jest.fn();
const generateMock = jest.fn();
jest.mock("../src/actions/media.action", () => ({
	listMediaAction: (...args: unknown[]) => listMock(...args),
	updateMediaAltAction: (...args: unknown[]) => updateMock(...args),
	generateMediaAltAction: (...args: unknown[]) => generateMock(...args),
}));
jest.mock("../src/actions/image-upload.action", () => ({
	imageUploadAction: jest.fn(),
}));

const cat = {
	id: "f1",
	path: "https://cdn.example.com/images/media/cat.jpg",
	relativePath: "images/media/cat.jpg",
	alt: "Рудий кіт",
	originalName: "cat.jpg",
	mimeType: "image/jpeg",
	size: 1000,
	createdAt: "2026-10-18T00:00:00.000Z",
};
const dog = { ...cat, id: "f2", alt: null, originalName: "dog.jpg" };

describe("MediaPickerPanel", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		listMock.mockResolvedValue({
			success: true,
			data: { items: [cat, dog], count: 2, currentPage: 1, totalPages: 1 },
		});
	});

	it("picks an image with its saved alt without touching the library", async () => {
		const onPick = jest.fn();
		render(<MediaPickerPanel onPick={onPick} />, asAdmin);

		fireEvent.click(await screen.findByTitle("Рудий кіт"));
		expect(screen.getByLabelText("Альтернативний текст")).toHaveValue(
			"Рудий кіт",
		);
		fireEvent.click(screen.getByRole("button", { name: "Обрати" }));

		await waitFor(() =>
			expect(onPick).toHaveBeenCalledWith({
				id: "f1",
				path: cat.path,
				alt: "Рудий кіт",
			}),
		);
		expect(updateMock).not.toHaveBeenCalled();
	});

	it("saves an alt written in the picker back to the library", async () => {
		updateMock.mockResolvedValue({
			success: true,
			data: { ...dog, alt: "Собака на огляді" },
		});
		const onPick = jest.fn();
		render(
			<MediaPickerPanel onPick={onPick} confirmLabel="Вставити" />,
			asAdmin,
		);

		fireEvent.click(await screen.findByTitle("dog.jpg"));
		fireEvent.change(screen.getByLabelText("Альтернативний текст"), {
			target: { value: " Собака на огляді " },
		});
		fireEvent.click(screen.getByRole("button", { name: "Вставити" }));

		await waitFor(() =>
			expect(onPick).toHaveBeenCalledWith({
				id: "f2",
				path: dog.path,
				alt: "Собака на огляді",
			}),
		);
		expect(updateMock).toHaveBeenCalledWith("f2", "Собака на огляді");
	});

	it("fills the alt from the AI without saving it", async () => {
		generateMock.mockResolvedValue({
			success: true,
			data: { alt: "Пес породи бігль" },
		});
		render(<MediaPickerPanel onPick={jest.fn()} />, asAdmin);

		fireEvent.click(await screen.findByTitle("dog.jpg"));
		fireEvent.click(screen.getByRole("button", { name: /Згенерувати ШІ/ }));

		await waitFor(() =>
			expect(screen.getByLabelText("Альтернативний текст")).toHaveValue(
				"Пес породи бігль",
			),
		);
		expect(generateMock).toHaveBeenCalledWith("f2", { current: undefined });
		expect(updateMock).not.toHaveBeenCalled();
	});

	it("lets an author write alt for this insert only — no library save, no AI", async () => {
		const onPick = jest.fn();
		render(<MediaPickerPanel onPick={onPick} />);

		fireEvent.click(await screen.findByTitle("dog.jpg"));
		expect(
			screen.queryByRole("button", { name: /Згенерувати ШІ/ }),
		).not.toBeInTheDocument();
		fireEvent.change(screen.getByLabelText("Альтернативний текст"), {
			target: { value: "Собака" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Обрати" }));

		await waitFor(() =>
			expect(onPick).toHaveBeenCalledWith({
				id: "f2",
				path: dog.path,
				alt: "Собака",
			}),
		);
		expect(updateMock).not.toHaveBeenCalled();
	});

	it("refuses a pick the form's validator rejects", async () => {
		const onPick = jest.fn();
		render(
			<MediaPickerPanel
				onPick={onPick}
				validatePick={async () => "Картинка зайнята"}
			/>,
		);

		fireEvent.click(await screen.findByTitle("Рудий кіт"));
		fireEvent.click(screen.getByRole("button", { name: "Обрати" }));

		await waitFor(() =>
			expect(screen.getByRole("button", { name: "Обрати" })).toBeEnabled(),
		);
		expect(onPick).not.toHaveBeenCalled();
	});
});
