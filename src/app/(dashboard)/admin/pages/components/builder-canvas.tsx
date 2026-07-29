"use client";
import {
	ArrowDown,
	ArrowUp,
	Copy,
	Plus,
	Settings2,
	Trash2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { PageBlockView } from "@/components/page-blocks";
import { raleway } from "@/lib/fonts";
import type { PageBlock } from "@/lib/page-builder/types";
import { cn } from "@/lib/utils";
import { BLOCK_META, BlockTypeIcon } from "./block-registry";

const Lexical = dynamic(
	() => import("@/app/(dashboard)/admin/components/Editor/Lexical"),
	{ ssr: false },
);

export type PreviewDevice = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<PreviewDevice, number> = {
	desktop: 1024,
	tablet: 720,
	mobile: 390,
};

interface CanvasProps {
	title: string;
	blocks: PageBlock[];
	selectedId: string | null;
	device: PreviewDevice;
	onSelect: (id: string | null) => void;
	onMove: (id: string, dir: -1 | 1) => void;
	onDuplicate: (id: string) => void;
	onDelete: (id: string) => void;
	onAdd: (index: number) => void;
	onPatchBlock: (id: string, patch: Record<string, unknown>) => void;
}

export function BuilderCanvas({
	title,
	blocks,
	selectedId,
	device,
	onSelect,
	onMove,
	onDuplicate,
	onDelete,
	onAdd,
	onPatchBlock,
}: CanvasProps) {
	return (
		<div className="bg-primary/5 border-border min-w-0 flex-1 overflow-x-auto rounded-xl border p-4 md:p-6">
			<div
				style={{ width: DEVICE_WIDTH[device] }}
				className="border-border mx-auto max-w-full overflow-hidden rounded-xl border bg-white shadow-xl"
			>
				<div className="p-6 md:p-8">
					{title && (
						<h1
							className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
						>
							{title}
						</h1>
					)}
					{blocks.map((block, index) => (
						<BlockShell
							key={block.id}
							block={block}
							index={index}
							total={blocks.length}
							active={selectedId === block.id}
							onSelect={onSelect}
							onMove={onMove}
							onDuplicate={onDuplicate}
							onDelete={onDelete}
							onAdd={onAdd}
							onPatchBlock={onPatchBlock}
						/>
					))}
					<InsertBar always onAdd={() => onAdd(blocks.length)} />
				</div>
			</div>
		</div>
	);
}

interface ShellProps {
	block: PageBlock;
	index: number;
	total: number;
	active: boolean;
	onSelect: (id: string | null) => void;
	onMove: (id: string, dir: -1 | 1) => void;
	onDuplicate: (id: string) => void;
	onDelete: (id: string) => void;
	onAdd: (index: number) => void;
	onPatchBlock: (id: string, patch: Record<string, unknown>) => void;
}

function BlockShell({
	block,
	index,
	total,
	active,
	onSelect,
	onMove,
	onDuplicate,
	onDelete,
	onAdd,
	onPatchBlock,
}: ShellProps) {
	const [hover, setHover] = useState(false);
	const visible = hover || active;
	const isRichText = block.type === "richtext";

	return (
		<div
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div
				onClick={() => onSelect(block.id)}
				className={cn(
					"relative cursor-pointer outline-2 -outline-offset-2 transition-[outline-color]",
					active
						? "outline-primary"
						: hover
							? "outline-primary/30"
							: "outline-transparent",
				)}
			>
				{visible && (
					<div
						className={cn(
							"absolute top-0 left-0 z-10 flex items-center gap-1.5 rounded-br-lg px-2 py-1 text-[11px] font-bold text-white",
							active ? "bg-primary" : "bg-primary/70",
						)}
					>
						<BlockTypeIcon type={block.type} className="h-3 w-3" />
						{BLOCK_META[block.type].label}
					</div>
				)}
				{visible && (
					<div
						className="border-border absolute top-2 right-2 z-10 flex gap-0.5 rounded-lg border bg-white p-1 shadow-lg"
						onClick={(event) => event.stopPropagation()}
					>
						<ToolButton
							title="Вгору"
							disabled={index === 0}
							onClick={() => onMove(block.id, -1)}
						>
							<ArrowUp className="h-3.5 w-3.5" />
						</ToolButton>
						<ToolButton
							title="Вниз"
							disabled={index === total - 1}
							onClick={() => onMove(block.id, 1)}
						>
							<ArrowDown className="h-3.5 w-3.5" />
						</ToolButton>
						<ToolButton title="Дублювати" onClick={() => onDuplicate(block.id)}>
							<Copy className="h-3.5 w-3.5" />
						</ToolButton>
						<ToolButton title="Налаштування" onClick={() => onSelect(block.id)}>
							<Settings2 className="h-3.5 w-3.5" />
						</ToolButton>
						<ToolButton
							title="Видалити"
							danger
							onClick={() => onDelete(block.id)}
						>
							<Trash2 className="h-3.5 w-3.5" />
						</ToolButton>
					</div>
				)}
				{isRichText ? (
					<div className="cursor-text py-2">
						<Lexical
							hideTitle
							initialContent={
								block.type === "richtext" && block.data.content
									? block.data.content
									: undefined
							}
							onChangeContent={(content: string) =>
								onPatchBlock(block.id, { content })
							}
						/>
					</div>
				) : (
					<div className="pointer-events-none">
						<CanvasBlockPreview block={block} />
					</div>
				)}
			</div>
			<InsertBar onAdd={() => onAdd(index + 1)} />
		</div>
	);
}

function CanvasBlockPreview({ block }: { block: PageBlock }) {
	if (block.type === "image" && !block.data.url) {
		return (
			<EmptyPlaceholder label="Зображення — додайте файл у налаштуваннях блоку" />
		);
	}
	if (block.type === "gallery" && !block.data.images.length) {
		return (
			<EmptyPlaceholder label="Галерея — додайте зображення у налаштуваннях блоку" />
		);
	}
	return <PageBlockView block={block} />;
}

function EmptyPlaceholder({ label }: { label: string }) {
	return (
		<div className="border-primary/30 bg-primary/5 text-primary my-4 flex h-36 items-center justify-center rounded-xl border-2 border-dashed text-sm font-medium">
			{label}
		</div>
	);
}

function ToolButton({
	children,
	title,
	onClick,
	disabled,
	danger,
}: {
	children: React.ReactNode;
	title: string;
	onClick: () => void;
	disabled?: boolean;
	danger?: boolean;
}) {
	return (
		<button
			type="button"
			title={title}
			disabled={disabled}
			onClick={onClick}
			className={cn(
				"flex h-7 w-7 items-center justify-center rounded-md transition-colors",
				disabled
					? "text-muted-foreground/40"
					: danger
						? "text-destructive hover:bg-destructive/10"
						: "text-muted-foreground hover:bg-primary/10 hover:text-primary",
			)}
		>
			{children}
		</button>
	);
}

function InsertBar({ onAdd, always }: { onAdd: () => void; always?: boolean }) {
	return (
		<div
			className={cn(
				"group relative z-[5] flex items-center justify-center",
				always ? "h-14" : "h-4",
			)}
		>
			<div
				className={cn(
					"absolute right-6 left-6 h-0.5 rounded-full transition-colors",
					always
						? "bg-transparent"
						: "bg-transparent group-hover:bg-primary/40",
				)}
			/>
			<button
				type="button"
				onClick={onAdd}
				className={cn(
					"relative inline-flex items-center gap-1.5 rounded-full text-xs font-bold transition-opacity",
					always
						? "border-primary/40 bg-primary/5 text-primary border-[1.5px] border-dashed px-4 py-2.5"
						: "bg-primary px-3 py-1 text-white opacity-0 shadow-md group-hover:opacity-100",
				)}
			>
				<Plus className="h-3.5 w-3.5" />
				{always ? "Додати секцію" : "Вставити"}
			</button>
		</div>
	);
}
