/**
 * Регресія: картинка в редакторі мусить одразу опинитись у DOM.
 * Раніше playground-версія ImageComponent «підвішувала» рендер до onload
 * прелоада `new Image()` — Firefox скасовував той осиротілий запит
 * (NS_BINDING_ABORTED), onload не наставав, і <img> не з'являвся ніколи.
 */
import { render, waitFor } from "@testing-library/react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useContext } from "react";
import ImageComponent from "@/app/(dashboard)/admin/components/Editor/Lexical/nodes/ImageComponent";
import { ImageNode } from "@/app/(dashboard)/admin/components/Editor/Lexical/nodes/ImageNode";
import "@testing-library/jest-dom";

jest.mock("../src/actions/image-upload.action", () => ({
	imageUploadAction: jest.fn(),
}));

const SRC = "https://dev-cdn.vethealth.com.ua/images/posts/content/cat.jpeg";

function Harness() {
	// ImageComponent потребує композер-контекст (useLexicalComposerContext).
	useContext(LexicalComposerContext);
	return (
		<ImageComponent
			src={SRC}
			altText="Кіт"
			nodeKey="image-1"
			width="inherit"
			height="inherit"
			maxWidth={500}
			resizable
			showCaption={false}
			captionsEnabled={false}
		/>
	);
}

describe("ImageComponent", () => {
	it("рендерить <img> одразу, без очікування прелоада", async () => {
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
				<Harness />
			</LexicalComposer>,
		);

		await waitFor(() => {
			const img = container.querySelector("img");
			expect(img).not.toBeNull();
			expect(img).toHaveAttribute("src", SRC);
			expect(img).toHaveAttribute("alt", "Кіт");
		});
	});
});
