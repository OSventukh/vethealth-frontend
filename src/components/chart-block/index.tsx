"use client";

import { ChartRenderer } from "./chart-renderer";
import type { ChartBlockData } from "./types";

/**
 * Готовий блок діаграми (діаграма + підпис) — спільний для Lexical-редактора
 * і публічного ParsedContent, щоб адмінка та сайт рендерили однаково.
 */
export function ChartBlock({ data }: { data: ChartBlockData }) {
	return (
		<figure className="not-prose my-6">
			<ChartRenderer
				data={data}
				className="aspect-auto h-[300px] md:h-[360px]"
			/>
			{data.title ? (
				<figcaption className="mt-2 text-center text-sm text-gray-600">
					{data.title}
				</figcaption>
			) : null}
		</figure>
	);
}
