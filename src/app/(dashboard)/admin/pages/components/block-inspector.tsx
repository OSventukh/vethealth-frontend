"use client";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PageBlock } from "@/lib/page-builder/types";
import { BLOCK_META, BlockTypeIcon } from "./block-registry";
import { Field, Segmented } from "./fields";
import { ImageField } from "./image-field";
import { ListEditor } from "./list-editor";

interface Props {
	block: PageBlock;
	onPatch: (id: string, patch: Record<string, unknown>) => void;
	onDelete: (id: string) => void;
	onClose: () => void;
}

export function BlockInspector({ block, onPatch, onDelete, onClose }: Props) {
	const patch = (values: Record<string, unknown>) => onPatch(block.id, values);

	return (
		<div className="border-border rounded-xl border bg-white p-4 shadow-sm">
			<div className="mb-4 flex items-center justify-between gap-2">
				<div className="flex items-center gap-2.5">
					<span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
						<BlockTypeIcon type={block.type} className="h-4 w-4" />
					</span>
					<div>
						<div className="text-sm font-bold">
							{BLOCK_META[block.type].label}
						</div>
						<div className="text-muted-foreground text-[11px]">
							Налаштування блоку
						</div>
					</div>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="h-7 w-7"
					onClick={onClose}
				>
					<X className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex flex-col gap-3.5">
				<BlockFields block={block} patch={patch} />
				<div className="bg-border h-px" />
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="border-destructive/30 text-destructive hover:bg-destructive/5 gap-2"
					onClick={() => onDelete(block.id)}
				>
					<Trash2 className="h-4 w-4" />
					Видалити секцію
				</Button>
			</div>
		</div>
	);
}

function BlockFields({
	block,
	patch,
}: {
	block: PageBlock;
	patch: (values: Record<string, unknown>) => void;
}) {
	switch (block.type) {
		case "hero": {
			const data = block.data;
			return (
				<>
					<Field label="Надзаголовок">
						<Input
							value={data.eyebrow}
							onChange={(e) => patch({ eyebrow: e.target.value })}
						/>
					</Field>
					<Field label="Заголовок">
						<Input
							value={data.title}
							onChange={(e) => patch({ title: e.target.value })}
						/>
					</Field>
					<Field label="Текст">
						<Textarea
							value={data.text}
							onChange={(e) => patch({ text: e.target.value })}
						/>
					</Field>
					<Field label="Текст кнопки">
						<Input
							value={data.ctaLabel}
							onChange={(e) => patch({ ctaLabel: e.target.value })}
						/>
					</Field>
					<Field label="Посилання кнопки">
						<Input
							value={data.ctaHref}
							placeholder="/contacts або https://…"
							onChange={(e) => patch({ ctaHref: e.target.value })}
						/>
					</Field>
					<Field label="Зображення">
						<ImageField
							value={data.imageUrl}
							onChange={(imageUrl) => patch({ imageUrl })}
						/>
					</Field>
					<Field label="Alt зображення">
						<Input
							value={data.imageAlt}
							onChange={(e) => patch({ imageAlt: e.target.value })}
						/>
					</Field>
				</>
			);
		}
		case "heading":
			return (
				<Field label="Текст заголовка">
					<Input
						value={block.data.text}
						onChange={(e) => patch({ text: e.target.value })}
					/>
				</Field>
			);
		case "richtext":
			return (
				<p className="text-muted-foreground text-xs leading-relaxed">
					Цей блок редагується безпосередньо в превʼю — клікніть на текст
					усередині та користуйтеся панеллю форматування.
				</p>
			);
		case "stats":
			return (
				<Field label="Показники">
					<ListEditor
						items={block.data.items}
						onChange={(items) => patch({ items })}
						createItem={() => ({ value: "0", label: "показник" })}
						addLabel="Додати показник"
						renderItem={(item, update) => (
							<div className="grid grid-cols-2 gap-2">
								<Input
									value={item.value}
									placeholder="24/7"
									onChange={(e) => update({ value: e.target.value })}
								/>
								<Input
									value={item.label}
									placeholder="підпис"
									onChange={(e) => update({ label: e.target.value })}
								/>
							</div>
						)}
					/>
				</Field>
			);
		case "services": {
			const data = block.data;
			return (
				<>
					<Field label="Заголовок">
						<Input
							value={data.title}
							onChange={(e) => patch({ title: e.target.value })}
						/>
					</Field>
					<Field label="Колонок">
						<Segmented
							value={String(data.cols) as "2" | "3" | "4"}
							onChange={(value) => patch({ cols: Number(value) })}
							options={[
								{ value: "2", label: "2" },
								{ value: "3", label: "3" },
								{ value: "4", label: "4" },
							]}
						/>
					</Field>
					<Field label="Послуги">
						<ListEditor
							items={data.items}
							onChange={(items) => patch({ items })}
							createItem={() => ({ title: "Нова послуга", description: "" })}
							addLabel="Додати послугу"
							renderItem={(item, update) => (
								<div className="flex flex-col gap-2">
									<Input
										value={item.title}
										placeholder="Назва"
										onChange={(e) => update({ title: e.target.value })}
									/>
									<Textarea
										value={item.description}
										placeholder="Короткий опис"
										className="min-h-14"
										onChange={(e) => update({ description: e.target.value })}
									/>
								</div>
							)}
						/>
					</Field>
				</>
			);
		}
		case "team":
			return (
				<>
					<Field label="Заголовок">
						<Input
							value={block.data.title}
							onChange={(e) => patch({ title: e.target.value })}
						/>
					</Field>
					<Field label="Учасники">
						<ListEditor
							items={block.data.members}
							onChange={(members) => patch({ members })}
							createItem={() => ({ name: "", role: "", photoUrl: "" })}
							addLabel="Додати учасника"
							renderItem={(member, update) => (
								<div className="flex flex-col gap-2">
									<ImageField
										value={member.photoUrl}
										onChange={(photoUrl) => update({ photoUrl })}
									/>
									<Input
										value={member.name}
										placeholder="Ім'я Прізвище"
										onChange={(e) => update({ name: e.target.value })}
									/>
									<Input
										value={member.role}
										placeholder="Спеціалізація"
										onChange={(e) => update({ role: e.target.value })}
									/>
								</div>
							)}
						/>
					</Field>
				</>
			);
		case "gallery":
			return (
				<Field label="Зображення">
					<ListEditor
						items={block.data.images}
						onChange={(images) => patch({ images })}
						createItem={() => ({ url: "", alt: "" })}
						addLabel="Додати зображення"
						renderItem={(image, update) => (
							<div className="flex flex-col gap-2">
								<ImageField
									value={image.url}
									onChange={(url) => update({ url })}
								/>
								<Input
									value={image.alt}
									placeholder="Alt-текст"
									onChange={(e) => update({ alt: e.target.value })}
								/>
							</div>
						)}
					/>
				</Field>
			);
		case "image":
			return (
				<>
					<Field label="Зображення">
						<ImageField
							value={block.data.url}
							onChange={(url) => patch({ url })}
						/>
					</Field>
					<Field label="Alt-текст">
						<Input
							value={block.data.alt}
							onChange={(e) => patch({ alt: e.target.value })}
						/>
					</Field>
					<Field label="Підпис">
						<Input
							value={block.data.caption}
							onChange={(e) => patch({ caption: e.target.value })}
						/>
					</Field>
				</>
			);
		case "cta":
			return (
				<>
					<Field label="Заголовок">
						<Input
							value={block.data.title}
							onChange={(e) => patch({ title: e.target.value })}
						/>
					</Field>
					<Field label="Текст">
						<Textarea
							value={block.data.text}
							onChange={(e) => patch({ text: e.target.value })}
						/>
					</Field>
					<Field label="Текст кнопки">
						<Input
							value={block.data.btnLabel}
							onChange={(e) => patch({ btnLabel: e.target.value })}
						/>
					</Field>
					<Field label="Посилання кнопки">
						<Input
							value={block.data.btnHref}
							placeholder="/contacts або https://…"
							onChange={(e) => patch({ btnHref: e.target.value })}
						/>
					</Field>
				</>
			);
		case "faq":
			return (
				<>
					<Field label="Заголовок">
						<Input
							value={block.data.title}
							onChange={(e) => patch({ title: e.target.value })}
						/>
					</Field>
					<Field label="Питання">
						<ListEditor
							items={block.data.items}
							onChange={(items) => patch({ items })}
							createItem={() => ({ question: "", answer: "" })}
							addLabel="Додати питання"
							renderItem={(item, update) => (
								<div className="flex flex-col gap-2">
									<Input
										value={item.question}
										placeholder="Запитання"
										onChange={(e) => update({ question: e.target.value })}
									/>
									<Textarea
										value={item.answer}
										placeholder="Відповідь"
										onChange={(e) => update({ answer: e.target.value })}
									/>
								</div>
							)}
						/>
					</Field>
				</>
			);
		case "contacts":
			return (
				<>
					<Field label="Заголовок">
						<Input
							value={block.data.title}
							onChange={(e) => patch({ title: e.target.value })}
						/>
					</Field>
					<Field label="Адреса">
						<Input
							value={block.data.address}
							onChange={(e) => patch({ address: e.target.value })}
						/>
					</Field>
					<Field label="Телефон">
						<Input
							value={block.data.phone}
							onChange={(e) => patch({ phone: e.target.value })}
						/>
					</Field>
					<Field label="Email">
						<Input
							value={block.data.email}
							onChange={(e) => patch({ email: e.target.value })}
						/>
					</Field>
					<Field label="Графік роботи">
						<Input
							value={block.data.schedule}
							onChange={(e) => patch({ schedule: e.target.value })}
						/>
					</Field>
				</>
			);
		default:
			return null;
	}
}
