"use client";
import { SparklesIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
	type GeneratedSeoMetadata,
	type GenerateSeoInput,
	generateSeoAction,
} from "../actions/generate-seo.action";
import type { SeoDraft } from "../seo/seo-fields";

interface Props {
	/** Збирає вхід для генерації з поточного стану редактора. */
	getInput: () => GenerateSeoInput;
	/**
	 * Застосовує згенеровані поля до форми; повертає кількість реально
	 * заповнених (порожніх до того) полів.
	 */
	onGenerated: (data: GeneratedSeoMetadata) => number;
	/**
	 * Поточні значення SEO-полів. Попередження ШІ показуються, лише поки поле
	 * містить саме згенероване значення: після ручної правки воно застаріле.
	 */
	values: SeoDraft;
}

export function GenerateSeoButton({ getInput, onGenerated, values }: Props) {
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();
	const [hint, setHint] = useState("");
	const [primaryKeyword, setPrimaryKeyword] = useState("");
	const [review, setReview] = useState<{
		generated: GeneratedSeoMetadata;
		warnings: string[];
	}>();
	// Бекенд префіксує попередження назвою поля (`metaTitle: …`).
	const warnings =
		review?.warnings.filter((warning) => {
			const field = warning.split(":")[0] as keyof SeoDraft;
			const generated = review.generated[field];
			return (
				generated === undefined || values[field]?.trim() === generated.trim()
			);
		}) ?? [];

	const handleGenerate = () => {
		const input = {
			...getInput(),
			hint: hint.trim() || undefined,
			primaryKeyword: primaryKeyword.trim() || undefined,
		};
		if (!input.fields.length) {
			toast({
				description:
					"Усі поля вже заповнені. Очистіть потрібне поле і згенеруйте знову",
			});
			return;
		}
		setReview(undefined);
		if (!input.title.trim() || !input.text.trim()) {
			toast({
				variant: "destructive",
				description:
					"Спочатку заповніть заголовок і текст — ШІ генерує мета-поля з контенту",
			});
			return;
		}

		startTransition(async () => {
			const result = await generateSeoAction(input);
			if (!result.success || !result.data) {
				toast({
					variant: "destructive",
					description: result.message || "Не вдалося згенерувати мета-поля",
				});
				return;
			}

			setReview({ generated: result.data, warnings: result.warnings ?? [] });
			const applied = onGenerated(result.data);
			toast({
				variant: applied > 0 ? "success" : "default",
				description:
					applied > 0
						? "Мета-поля згенеровано — перегляньте і збережіть"
						: "Усі поля вже заповнені. Очистіть потрібне поле і згенеруйте знову",
			});
		});
	};

	return (
		<div className="flex w-full flex-col gap-2">
			<Input
				aria-label="Головний пошуковий запит"
				placeholder="Головний пошуковий запит (необовʼязково)"
				value={primaryKeyword}
				onChange={(event) => setPrimaryKeyword(event.target.value)}
				maxLength={150}
				disabled={isPending}
			/>
			<Input
				aria-label="Побажання для ШІ"
				placeholder="Побажання для ШІ (необовʼязково)"
				value={hint}
				onChange={(event) => setHint(event.target.value)}
				maxLength={300}
				disabled={isPending}
			/>
			<Button
				type="button"
				variant="outline"
				onClick={handleGenerate}
				disabled={isPending}
			>
				<SparklesIcon className="mr-2 h-4 w-4" />
				{isPending ? "Генеруємо…" : "Заповнити з ШІ"}
			</Button>
			{warnings.length > 0 && (
				<p role="status" className="text-sm text-amber-700">
					Перевірте перед збереженням: {warnings.join(" ")}
				</p>
			)}
		</div>
	);
}
