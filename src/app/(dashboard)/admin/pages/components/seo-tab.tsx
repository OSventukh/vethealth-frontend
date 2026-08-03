"use client";
import type { GeneratedSeoMetadata } from "@/app/(dashboard)/admin/actions/generate-seo.action";
import { GenerateSeoButton } from "@/app/(dashboard)/admin/components/generate-seo-button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { extractPageBlocksText } from "@/lib/content-text";
import type { PageBlock } from "@/lib/page-builder/types";
import { Field } from "./fields";
import { ImageField } from "./image-field";

export interface PageMetadataState {
	metaTitle: string;
	metaDescription: string;
	canonicalUrl: string;
	ogImage: string;
	indexable: boolean;
	followable: boolean;
}

interface Props {
	pageTitle: string;
	slug: string;
	blocks: PageBlock[];
	metadata: PageMetadataState;
	onChange: (patch: Partial<PageMetadataState>) => void;
	/**
	 * Застосовує згенеровані ШІ поля. Живе в батьківському EditPage (там
	 * порожність полів перевіряється по актуальному стану через ref) — інакше
	 * колбек, захоплений на момент кліку, перетер би значення, введені вручну
	 * під час генерації.
	 */
	onApplyGenerated: (generated: GeneratedSeoMetadata) => number;
}

export function SeoTab({
	pageTitle,
	slug,
	blocks,
	metadata,
	onChange,
	onApplyGenerated,
}: Props) {
	const previewTitle = metadata.metaTitle || pageTitle || "Заголовок сторінки";

	return (
		<div className="flex max-w-2xl flex-col gap-4">
			<div className="border-border flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow-sm">
				<div>
					<div className="text-sm font-bold">ШІ-заповнення мета-полів</div>
					<p className="text-muted-foreground text-sm">
						Згенерує порожні Meta Title і Meta Description з контенту сторінки.
					</p>
				</div>
				<GenerateSeoButton
					getInput={() => ({
						title: pageTitle,
						text: extractPageBlocksText(blocks),
						entityType: "page" as const,
					})}
					onGenerated={onApplyGenerated}
				/>
			</div>

			<div className="border-border rounded-xl border bg-white p-4 shadow-sm">
				<div className="mb-3 text-sm font-bold">Превʼю в Google</div>
				<div className="border-border rounded-lg border p-4">
					<div className="mb-2 flex items-center gap-2.5">
						<span className="from-primary flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br to-orange-400 text-[11px] font-bold text-white">
							V
						</span>
						<div className="leading-tight">
							<div className="text-xs font-semibold">VetHealth</div>
							<div className="text-muted-foreground text-[11px]">
								vethealth.com.ua › {slug || "page"}
							</div>
						</div>
					</div>
					<div className="font-arial text-lg leading-snug text-[#1a0dab]">
						{previewTitle}
					</div>
					<div className="text-muted-foreground mt-1 text-sm leading-normal">
						{metadata.metaDescription ||
							"Опис зʼявиться тут, коли ви заповните мета-опис."}
					</div>
				</div>
			</div>

			<div className="border-border flex flex-col gap-3.5 rounded-xl border bg-white p-4 shadow-sm">
				<div className="text-sm font-bold">Мета-теги</div>
				<Field label="Meta Title">
					<Input
						value={metadata.metaTitle}
						placeholder={pageTitle}
						onChange={(e) => onChange({ metaTitle: e.target.value })}
					/>
				</Field>
				<Field label="Meta Description">
					<Textarea
						value={metadata.metaDescription}
						placeholder="Стислий опис сторінки для пошукових систем…"
						onChange={(e) => onChange({ metaDescription: e.target.value })}
					/>
				</Field>
				<Field label="Canonical URL">
					<Input
						value={metadata.canonicalUrl}
						placeholder="https://vethealth.com.ua/…"
						className="font-mono text-sm"
						onChange={(e) => onChange({ canonicalUrl: e.target.value })}
					/>
				</Field>
			</div>

			<div className="border-border flex flex-col gap-3.5 rounded-xl border bg-white p-4 shadow-sm">
				<div className="text-sm font-bold">Індексація</div>
				<div className="grid gap-3 sm:grid-cols-2">
					<label className="border-border flex cursor-pointer items-center gap-3 rounded-lg border p-3">
						<Switch
							checked={metadata.indexable}
							onCheckedChange={(indexable: boolean) => onChange({ indexable })}
						/>
						<span>
							<span className="block text-sm font-semibold">index</span>
							<span className="text-muted-foreground block text-xs">
								Дозволити індексацію
							</span>
						</span>
					</label>
					<label className="border-border flex cursor-pointer items-center gap-3 rounded-lg border p-3">
						<Switch
							checked={metadata.followable}
							onCheckedChange={(followable: boolean) =>
								onChange({ followable })
							}
						/>
						<span>
							<span className="block text-sm font-semibold">follow</span>
							<span className="text-muted-foreground block text-xs">
								Передавати вагу посилань
							</span>
						</span>
					</label>
				</div>
			</div>

			<div className="border-border flex flex-col gap-3.5 rounded-xl border bg-white p-4 shadow-sm">
				<div className="text-sm font-bold">Обкладинка для шерингу (OG)</div>
				<ImageField
					value={metadata.ogImage}
					onChange={(ogImage) => onChange({ ogImage })}
				/>
			</div>
		</div>
	);
}
