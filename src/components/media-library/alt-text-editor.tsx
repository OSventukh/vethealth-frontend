"use client";
import { Loader2, Sparkles } from "lucide-react";
import { useId, useTransition } from "react";
import { generateMediaAltAction } from "@/actions/media.action";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useCanManageMedia } from "./media-permissions";

/** Орієнтир для скрінрідерів; жорстко не обмежуємо (бекенд — до 500). */
const RECOMMENDED_MAX = 125;

interface AltTextEditorProps {
	mediaId: string;
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

/** Поле alt-тексту з генерацією ШІ: результат лише підставляється, не зберігається. */
export function AltTextEditor({
	mediaId,
	value,
	onChange,
	disabled,
}: AltTextEditorProps) {
	const id = useId();
	const [generating, startGenerating] = useTransition();
	// ШІ-генерація платна і доступна лише Admin+ (бекенд інакше дасть 403).
	const canGenerate = useCanManageMedia();

	const generate = () =>
		startGenerating(async () => {
			const result = await generateMediaAltAction(mediaId, {
				current: value || undefined,
			});
			if (!result.success) {
				toast({ variant: "destructive", description: result.message });
				return;
			}
			onChange(result.data.alt);
		});

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-2">
				<Label htmlFor={id}>Альтернативний текст</Label>
				{canGenerate && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="gap-1.5"
						disabled={disabled || generating}
						onClick={generate}
					>
						{generating ? (
							<Loader2 size={14} className="animate-spin" />
						) : (
							<Sparkles size={14} />
						)}
						{value ? "Перегенерувати ШІ" : "Згенерувати ШІ"}
					</Button>
				)}
			</div>
			<Textarea
				id={id}
				value={value}
				maxLength={500}
				disabled={disabled || generating}
				placeholder="Що зображено: напр. «Ветеринар оглядає вухо рудого кота»"
				className="min-h-[84px]"
				onChange={(event) => onChange(event.target.value)}
			/>
			<p
				className={cn(
					"text-muted-foreground text-xs",
					value.length > RECOMMENDED_MAX && "text-amber-700",
				)}
			>
				{value.length} симв. · рекомендовано до {RECOMMENDED_MAX}. Порожній —
				для суто декоративних зображень.
			</p>
		</div>
	);
}
