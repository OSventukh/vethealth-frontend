/**
 * Smoke test for the admin Lexical editor after the migration to the
 * extension architecture (LexicalExtensionComposer): the editor must mount
 * a contenteditable root, load initial serialized content, and report
 * changes through onChangeContent.
 */
import { render, screen, waitFor } from "@testing-library/react";
import Lexical from "@/app/(dashboard)/admin/components/Editor/Lexical";
import "@testing-library/jest-dom";

// The ImagesPlugin pulls in the image-upload server action, which imports the
// API client (throws at import time without env). Not needed for this smoke.
jest.mock("../src/actions/image-upload.action", () => ({
	imageUploadAction: jest.fn(),
}));

const HELLO_STATE = JSON.stringify({
	root: {
		children: [
			{
				children: [
					{
						detail: 0,
						format: 0,
						mode: "normal",
						style: "",
						text: "Привіт зі старого формату",
						type: "text",
						version: 1,
					},
				],
				direction: "ltr",
				format: "",
				indent: 0,
				type: "paragraph",
				version: 1,
			},
		],
		direction: "ltr",
		format: "",
		indent: 0,
		type: "root",
		version: 1,
	},
});

describe("Lexical editor (extension architecture)", () => {
	it("mounts a contenteditable root and loads initial content", async () => {
		const onChangeContent = jest.fn();
		const { container } = render(
			<Lexical initialContent={HELLO_STATE} onChangeContent={onChangeContent} />,
		);

		const root = container.querySelector('[contenteditable="true"]');
		expect(root).not.toBeNull();
		expect(root).toHaveAttribute("data-lexical-editor", "true");

		await waitFor(() => {
			expect(root).toHaveTextContent("Привіт зі старого формату");
		});

		// OnChangePlugin serializes state back — the round-tripped JSON must
		// still contain the original text.
		await waitFor(() => {
			expect(onChangeContent).toHaveBeenCalled();
		});
		const lastPayload = onChangeContent.mock.calls.at(-1)?.[0] as string;
		expect(JSON.parse(lastPayload).root.children[0].children[0].text).toBe(
			"Привіт зі старого формату",
		);
	});

	it("shows the placeholder for an empty editor", () => {
		render(<Lexical />);
		expect(screen.getByText("Введіть текст...")).toBeInTheDocument();
	});

	it("seeds an empty paragraph on mount so the caret aligns with the placeholder", async () => {
		const { container } = render(<Lexical />);
		const root = container.querySelector('[contenteditable="true"]');
		// Without the paragraph the caret sits on the root's padding, one line
		// above the placeholder text (regression from passing an explicit null
		// $initialEditorState).
		await waitFor(() => {
			expect(root?.querySelector("p")).not.toBeNull();
		});
	});
});
