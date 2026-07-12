/**
 * Alt-текст вставленої картинки має бути редагованим: раніше ImageNode не мав
 * жодного сеттера для __altText, тож текст задавався тільки при вставці.
 */
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
	$createParagraphNode,
	$getRoot,
	CLICK_COMMAND,
	type LexicalEditor,
} from "lexical";
import { useEffect, useState } from "react";
import ImageComponent from "@/app/(dashboard)/admin/components/Editor/Lexical/nodes/ImageComponent";
import {
	$createImageNode,
	$isImageNode,
	ImageNode,
} from "@/app/(dashboard)/admin/components/Editor/Lexical/nodes/ImageNode";
import "@testing-library/jest-dom";

jest.mock("../src/actions/image-upload.action", () => ({
	imageUploadAction: jest.fn(),
}));

const SRC = "https://dev-cdn.vethealth.com.ua/images/posts/content/cat.jpeg";

/** Вставляє реальний ImageNode і рендерить його декоратор. */
function Harness({ onEditor }: { onEditor: (editor: LexicalEditor) => void }) {
	const [editor] = useLexicalComposerContext();
	const [nodeKey, setNodeKey] = useState<string | null>(null);

	useEffect(() => {
		onEditor(editor);
		editor.update(() => {
			const paragraph = $createParagraphNode();
			const image = $createImageNode({ src: SRC, altText: "Старий alt" });
			paragraph.append(image);
			$getRoot().append(paragraph);
			setNodeKey(image.getKey());
		});
	}, [editor, onEditor]);

	if (!nodeKey) return null;

	return (
		<ImageComponent
			src={SRC}
			altText="Старий alt"
			nodeKey={nodeKey}
			width="inherit"
			height="inherit"
			maxWidth={500}
			resizable
			showCaption={false}
			captionsEnabled={false}
		/>
	);
}

const readAltText = (editor: LexicalEditor): string => {
	let altText = "";
	editor.getEditorState().read(() => {
		editor.getEditorState()._nodeMap.forEach((node) => {
			if ($isImageNode(node)) {
				altText = node.getAltText();
			}
		});
	});
	return altText;
};

describe("ImageComponent · alt-текст", () => {
	it("дозволяє змінити alt-текст уже вставленої картинки", async () => {
		let editor!: LexicalEditor;

		const { container } = render(
			<LexicalComposer
				initialConfig={{
					namespace: "test",
					nodes: [ImageNode],
					onError: (error) => {
						throw error;
					},
				}}
			>
				<Harness
					onEditor={(instance) => {
						editor = instance;
					}}
				/>
			</LexicalComposer>,
		);

		const img = await waitFor(() => {
			const found = container.querySelector("img");
			expect(found).not.toBeNull();
			return found as HTMLImageElement;
		});
		expect(readAltText(editor)).toBe("Старий alt");

		// Кнопка редагування з'являється лише на виділеній картинці. У jsdom
		// нема ContentEditable-кореня, який зазвичай маршрутизує кліки в
		// Lexical, тож дублюємо це командою напряму.
		act(() => {
			editor.dispatchCommand(CLICK_COMMAND, {
				target: img,
			} as unknown as MouseEvent);
		});

		const editButton = await waitFor(() =>
			screen.getByRole("button", { name: /Alt-текст/i }),
		);
		fireEvent.click(editButton);

		// getByLabelText неоднозначний: заголовок діалогу дублює текст лейбла.
		const input = await waitFor(() =>
			screen.getByPlaceholderText("Опишіть, що зображено на картинці"),
		);
		expect(input).toHaveValue("Старий alt");

		fireEvent.change(input, { target: { value: "Кіт на підвіконні" } });
		fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));

		await waitFor(() => {
			expect(readAltText(editor)).toBe("Кіт на підвіконні");
		});
	});
});
