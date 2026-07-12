/**
 * Wiring test for the editor's "Вставити картинку" dialog after the shadcn
 * migration: file selection must call the upload action, enable the confirm
 * button, and dispatch INSERT_IMAGE_COMMAND with the uploaded path.
 */
import { fireEvent, render, waitFor } from "@testing-library/react";
import type { LexicalEditor } from "lexical";
import {
	INSERT_IMAGE_COMMAND,
	InsertImageDialog,
} from "@/app/(dashboard)/admin/components/Editor/Lexical/plugins/ImagesPlugin";
import "@testing-library/jest-dom";

const uploadMock = jest.fn();
jest.mock("../src/actions/image-upload.action", () => ({
	imageUploadAction: (...args: unknown[]) => uploadMock(...args),
}));

// Вендорений код використовує data-test-id (з дефісом), а не data-testid.
const byTestId = (id: string): HTMLElement => {
	const element = document.querySelector(`[data-test-id="${id}"]`);
	if (!element) throw new Error(`No element with data-test-id="${id}"`);
	return element as HTMLElement;
};

describe("InsertImageDialog (upload mode)", () => {
	beforeEach(() => uploadMock.mockReset());

	it("uploads the picked file and dispatches the insert command", async () => {
		uploadMock.mockResolvedValue({
			error: false,
			image: {
				id: "img-1",
				host: "https://dev-cdn.vethealth.com.ua",
				path: "https://dev-cdn.vethealth.com.ua/uploads/cat.png",
				// У R2-режимі relativePath — голий ключ бакета, не URL;
				// вставлятись у редактор має саме path.
				relativePath: "uploads/cat.png",
			},
		});
		const dispatchCommand = jest.fn();
		const activeEditor = { dispatchCommand } as unknown as LexicalEditor;
		const onClose = jest.fn();

		render(<InsertImageDialog activeEditor={activeEditor} onClose={onClose} />);

		fireEvent.click(byTestId("image-modal-option-file"));

		const file = new File(["png-bytes"], "cat.png", { type: "image/png" });
		fireEvent.change(byTestId("image-modal-file-upload"), {
			target: { files: [file] },
		});

		await waitFor(() => {
			expect(uploadMock).toHaveBeenCalledTimes(1);
		});
		expect(uploadMock.mock.calls[0][1]).toBe("post");
		const sentFormData = uploadMock.mock.calls[0][0] as FormData;
		expect(sentFormData.get("post")).toBe(file);

		const confirm = byTestId("image-modal-file-upload-btn");
		await waitFor(() => {
			expect(confirm).toBeEnabled();
		});

		fireEvent.change(byTestId("image-modal-alt-text-input"), {
			target: { value: "Кіт" },
		});
		fireEvent.click(confirm);

		expect(dispatchCommand).toHaveBeenCalledWith(INSERT_IMAGE_COMMAND, {
			altText: "Кіт",
			src: "https://dev-cdn.vethealth.com.ua/uploads/cat.png",
		});
		expect(onClose).toHaveBeenCalled();
	});

	it("keeps confirm disabled when the upload fails", async () => {
		uploadMock.mockResolvedValue({ error: true, message: "fail" });
		const activeEditor = {
			dispatchCommand: jest.fn(),
		} as unknown as LexicalEditor;

		render(
			<InsertImageDialog activeEditor={activeEditor} onClose={jest.fn()} />,
		);
		fireEvent.click(byTestId("image-modal-option-file"));

		const file = new File(["x"], "x.png", { type: "image/png" });
		fireEvent.change(byTestId("image-modal-file-upload"), {
			target: { files: [file] },
		});

		await waitFor(() => {
			expect(uploadMock).toHaveBeenCalled();
		});
		expect(byTestId("image-modal-file-upload-btn")).toBeDisabled();
	});
});
