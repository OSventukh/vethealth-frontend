import {
	AutoFocusExtension,
	HorizontalRuleExtension,
} from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { AutoLinkNode, ClickableLinkExtension, LinkExtension } from "@lexical/link";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";
import { configExtension, defineExtension } from "lexical";
import { ImageNode } from "./nodes/ImageNode";
import { LayoutContainerNode } from "./nodes/LayoutContainerNode";
import { LayoutItemNode } from "./nodes/LayoutItemNode";
import { TooltipNode } from "./nodes/TooltipNode";
import { validateUrl } from "./utils/url";

// Heading/Quote, List, Table, Link and HorizontalRule nodes are registered by
// their extensions; only nodes without a backing extension are listed here.
// AutoLinkNode stays registered so existing saved content keeps deserializing
// (the AutoLink plugin itself is not part of this editor).
export const editorExtension = defineExtension({
	name: "@vethealth/editor",
	namespace: "VethealthEditor",
	dependencies: [
		RichTextExtension,
		HistoryExtension,
		ListExtension,
		CheckListExtension,
		TableExtension,
		AutoFocusExtension,
		HorizontalRuleExtension,
		configExtension(LinkExtension, { validateUrl }),
		// The legacy ClickableLinkPlugin defaulted to newTab: true; the
		// extension defaults to false, so keep the old behavior explicitly.
		configExtension(ClickableLinkExtension, { newTab: true }),
	],
	nodes: [AutoLinkNode, ImageNode, LayoutContainerNode, LayoutItemNode, TooltipNode],
	theme: {
		root: "min-h-full border-[1px] border-border px-10 py-4 bg-background shadow-xs outline-hidden text-lg",
		text: {
			underline: "underline underline-offset-2",
			strikethrough: "line-through",
			italic: "italic",
		},
		link: "text-blue-600 underline underline-offset-2",
		list: {
			nested: {
				listitem: "list-inside",
			},
			ol: "list-decimal list-inside",
			ul: "list-disc list-inside",
			listitem: "editor-listItem",
		},
		layoutContainer: "grid gap-10",
		layoutItem: "border-[1px] border-slate-600 border-dashed",
		image: "inline-block relative",
		// TableExtension вмикає горизонтальний скрол таблиць і вимагає клас
		// для обгортки — без нього сипле dev-попередження в консоль.
		tableScrollableWrapper: "overflow-x-auto",
	},
	onError: (error: Error) => console.error(error),
});
