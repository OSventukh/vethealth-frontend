"use client";
import {
	ArrowLeft,
	LayoutGrid,
	Monitor,
	Plus,
	Search,
	Smartphone,
	Tablet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { PageResponse } from "@/api/types/pages.type";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createDefaultBlockData } from "@/lib/page-builder/defaults";
import {
	createBlockId,
	createDocumentFromLegacy,
	parsePageDocument,
	serializePageDocument,
} from "@/lib/page-builder/parse";
import {
	PAGE_DOCUMENT_VERSION,
	type PageBlock,
	type PageBlockType,
} from "@/lib/page-builder/types";
import { PageStatusEnum } from "../actions/page-status.enum";
import { savePageAction } from "../actions/save-page.action";
import { BlockInspector } from "./block-inspector";
import { BlockPicker } from "./block-picker";
import { BuilderCanvas, type PreviewDevice } from "./builder-canvas";
import { Segmented } from "./fields";
import { OutlinePanel } from "./outline-panel";
import { PageSettingsCard } from "./page-settings-card";
import { PublishCard } from "./publish-card";
import { type PageMetadataState, SeoTab } from "./seo-tab";

type Props = {
	initialData?: PageResponse | null;
	editMode?: boolean;
};

function initialBlocks(initialData?: PageResponse | null): PageBlock[] {
	const document = parsePageDocument(initialData?.content);
	if (document) return document.blocks;
	if (initialData?.content) {
		return createDocumentFromLegacy(initialData.content).blocks;
	}
	return [];
}

export default function EditPage({ initialData, editMode }: Props) {
	const [blocks, setBlocks] = useState<PageBlock[]>(() =>
		initialBlocks(initialData),
	);
	const [title, setTitle] = useState(initialData?.title || "");
	const [slug, setSlug] = useState(initialData?.slug || "");
	const [metadata, setMetadata] = useState<PageMetadataState>({
		metaTitle: initialData?.metadata?.metaTitle || "",
		metaDescription: initialData?.metadata?.metaDescription || "",
		canonicalUrl: initialData?.metadata?.canonicalUrl || "",
		ogImage: initialData?.metadata?.ogImage || "",
		indexable: initialData?.metadata?.indexable ?? true,
		followable: initialData?.metadata?.followable ?? true,
	});
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [pickerIndex, setPickerIndex] = useState<number | null>(null);
	const [activeTab, setActiveTab] = useState<"blocks" | "seo">("blocks");
	const [device, setDevice] = useState<PreviewDevice>("desktop");
	const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const router = useRouter();
	const { toast } = useToast();

	const addBlock = (index: number, type: PageBlockType) => {
		const block = {
			id: createBlockId(),
			type,
			data: createDefaultBlockData(type),
		} as PageBlock;
		setBlocks((prev) => {
			const next = [...prev];
			next.splice(index, 0, block);
			return next;
		});
		setSelectedId(block.id);
		setPickerIndex(null);
	};

	const moveBlock = (id: string, dir: -1 | 1) =>
		setBlocks((prev) => {
			const index = prev.findIndex((block) => block.id === id);
			const next = index + dir;
			if (index === -1 || next < 0 || next >= prev.length) return prev;
			const copy = [...prev];
			[copy[index], copy[next]] = [copy[next], copy[index]];
			return copy;
		});

	const duplicateBlock = (id: string) =>
		setBlocks((prev) => {
			const index = prev.findIndex((block) => block.id === id);
			if (index === -1) return prev;
			const source = prev[index];
			const copy = [...prev];
			copy.splice(index + 1, 0, {
				...source,
				id: createBlockId(),
				data: JSON.parse(JSON.stringify(source.data)),
			} as PageBlock);
			return copy;
		});

	const deleteBlock = (id: string) => {
		setBlocks((prev) => prev.filter((block) => block.id !== id));
		setSelectedId((current) => (current === id ? null : current));
	};

	const patchBlock = (id: string, patch: Record<string, unknown>) =>
		setBlocks((prev) =>
			prev.map((block) =>
				block.id === id
					? ({ ...block, data: { ...block.data, ...patch } } as PageBlock)
					: block,
			),
		);

	const saveHandler = (status: PageStatusEnum) => {
		startTransition(async () => {
			const res = await savePageAction(
				{
					id: initialData?.id,
					title,
					content: serializePageDocument({
						version: PAGE_DOCUMENT_VERSION,
						blocks,
					}),
					slug: slug || undefined,
					status: { id: status },
					metadata: {
						indexable: metadata.indexable,
						followable: metadata.followable,
						...(metadata.metaTitle && { metaTitle: metadata.metaTitle }),
						...(metadata.metaDescription && {
							metaDescription: metadata.metaDescription,
						}),
						...(metadata.canonicalUrl && {
							canonicalUrl: metadata.canonicalUrl,
						}),
						...(metadata.ogImage && { ogImage: metadata.ogImage }),
					},
				},
				editMode,
			);
			toast({
				variant: res.error ? "destructive" : "success",
				description: res.success ? "Сторінка збережена" : res.message,
			});
			if (res.success) {
				setLastSavedAt(
					new Date().toLocaleTimeString("uk-UA", {
						hour: "2-digit",
						minute: "2-digit",
					}),
				);
			}
			if (res.success && res.redirect) {
				router.replace(`edit/${res.redirect}`, { scroll: false });
			}
		});
	};

	const selectedBlock = blocks.find((block) => block.id === selectedId) || null;

	return (
		<div className="flex flex-col gap-4 p-4 md:p-6">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Link
						href="/admin/pages"
						className="border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border bg-white"
					>
						<ArrowLeft className="h-4 w-4" />
					</Link>
					<div>
						<div className="text-muted-foreground text-xs">
							Сторінки <span className="mx-1">/</span>
							<span className="text-foreground font-semibold">Редактор</span>
						</div>
						<h1 className="text-xl leading-tight font-bold">
							{title || "Нова сторінка"}
						</h1>
					</div>
				</div>
				<Segmented
					value={activeTab}
					onChange={setActiveTab}
					className="bg-white shadow-sm"
					options={[
						{
							value: "blocks",
							label: (
								<>
									<LayoutGrid className="h-3.5 w-3.5" />
									Блоки
								</>
							),
						},
						{
							value: "seo",
							label: (
								<>
									<Search className="h-3.5 w-3.5" />
									SEO та метадані
								</>
							),
						},
					]}
				/>
			</div>

			{activeTab === "blocks" && (
				<>
					{/* Canvas toolbar */}
					<div className="flex flex-wrap items-center justify-between gap-3">
						<Segmented
							value={device}
							onChange={setDevice}
							options={[
								{
									value: "desktop",
									label: (
										<>
											<Monitor className="h-3.5 w-3.5" />
											Desktop
										</>
									),
								},
								{
									value: "tablet",
									label: (
										<>
											<Tablet className="h-3.5 w-3.5" />
											Tablet
										</>
									),
								},
								{
									value: "mobile",
									label: (
										<>
											<Smartphone className="h-3.5 w-3.5" />
											Mobile
										</>
									),
								},
							]}
						/>
						<div className="flex items-center gap-3">
							<span className="text-muted-foreground text-xs">
								{blocks.length} секцій
							</span>
							<Button
								type="button"
								size="sm"
								className="gap-2"
								onClick={() => setPickerIndex(blocks.length)}
							>
								<Plus className="h-4 w-4" />
								Додати секцію
							</Button>
						</div>
					</div>

					<div className="flex flex-col items-start gap-4 lg:flex-row">
						<OutlinePanel
							blocks={blocks}
							selectedId={selectedId}
							onSelect={setSelectedId}
						/>
						<BuilderCanvas
							title={title}
							blocks={blocks}
							selectedId={selectedId}
							device={device}
							onSelect={setSelectedId}
							onMove={moveBlock}
							onDuplicate={duplicateBlock}
							onDelete={deleteBlock}
							onAdd={setPickerIndex}
							onPatchBlock={patchBlock}
						/>
						<aside className="flex w-full shrink-0 flex-col gap-4 self-start lg:w-80">
							<PublishCard
								statusName={initialData?.status}
								isPending={isPending}
								lastSavedAt={lastSavedAt}
								onPublish={() => saveHandler(PageStatusEnum.OnReview)}
								onSaveDraft={() => saveHandler(PageStatusEnum.Draft)}
							/>
							{selectedBlock ? (
								<BlockInspector
									block={selectedBlock}
									onPatch={patchBlock}
									onDelete={deleteBlock}
									onClose={() => setSelectedId(null)}
								/>
							) : (
								<PageSettingsCard
									title={title}
									slug={slug}
									onTitleChange={setTitle}
									onSlugChange={setSlug}
								/>
							)}
						</aside>
					</div>
				</>
			)}

			{activeTab === "seo" && (
				<div className="flex flex-col items-start gap-4 lg:flex-row">
					<div className="min-w-0 flex-1">
						<SeoTab
							pageTitle={title}
							slug={slug}
							blocks={blocks}
							metadata={metadata}
							onChange={(patch) =>
								setMetadata((current) => ({ ...current, ...patch }))
							}
						/>
					</div>
					<aside className="flex w-full shrink-0 flex-col gap-4 self-start lg:w-80">
						<PublishCard
							statusName={initialData?.status}
							isPending={isPending}
							lastSavedAt={lastSavedAt}
							onPublish={() => saveHandler(PageStatusEnum.OnReview)}
							onSaveDraft={() => saveHandler(PageStatusEnum.Draft)}
						/>
						<PageSettingsCard
							title={title}
							slug={slug}
							onTitleChange={setTitle}
							onSlugChange={setSlug}
						/>
					</aside>
				</div>
			)}

			<BlockPicker
				open={pickerIndex !== null}
				onClose={() => setPickerIndex(null)}
				onPick={(type) => {
					if (pickerIndex !== null) addBlock(pickerIndex, type);
				}}
			/>
		</div>
	);
}
