"use client";
import { SparklesIcon } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
	type GeneratedSeoMetadata,
	generateSeoAction,
} from "../actions/generate-seo.action";

interface Props {
	/** Збирає вхід для генерації з поточного стану редактора. */
	getInput: () => {
		title: string;
		text: string;
		topics?: string[];
		entityType: "post" | "page";
	};
	/**
	 * Застосовує згенеровані поля до форми; повертає кількість реально
	 * заповнених (порожніх до того) полів.
	 */
	onGenerated: (data: GeneratedSeoMetadata) => number;
}

export function GenerateSeoButton({ getInput, onGenerated }: Props) {
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	const handleGenerate = () => {
		const input = getInput();
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
		<Button
			type="button"
			variant="outline"
			onClick={handleGenerate}
			disabled={isPending}
		>
			<SparklesIcon className="mr-2 h-4 w-4" />
			{isPending ? "Генеруємо…" : "Заповнити з ШІ"}
		</Button>
	);
}
