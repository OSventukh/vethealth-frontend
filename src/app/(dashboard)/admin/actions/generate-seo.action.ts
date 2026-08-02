"use server";
import { auth } from "@/lib/session/auth";
import logger from "@/logger";

export interface GeneratedSeoMetadata {
	metaTitle: string;
	metaDescription: string;
	metaKeywords: string;
	ogTitle: string;
	ogDescription: string;
}

interface GenerateSeoInput {
	title: string;
	text: string;
	topics?: string[];
	entityType: "post" | "page";
}

interface GenerateSeoResult {
	success: boolean;
	message?: string;
	data?: GeneratedSeoMetadata;
}

const STATUS_MESSAGES: Record<number, string> = {
	429: "Забагато запитів — зачекайте хвилину і спробуйте ще раз",
	502: "ШІ-провайдер не відповів. Спробуйте ще раз",
	503: "ШІ не налаштовано: додайте API-ключ провайдера в env бекенда",
};

export async function generateSeoAction(
	input: GenerateSeoInput,
): Promise<GenerateSeoResult> {
	const session = await auth();
	try {
		const response = await fetch(`${process.env.API_SERVER}/ai/seo-metadata`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session?.token}`,
			},
			body: JSON.stringify(input),
			cache: "no-store",
		});

		if (!response.ok) {
			logger.error(
				`generateSeoAction: backend responded ${response.status} for "${input.title}"`,
			);
			return {
				success: false,
				message:
					STATUS_MESSAGES[response.status] ||
					"Не вдалося згенерувати мета-поля. Спробуйте ще раз",
			};
		}

		const data = (await response.json()) as GeneratedSeoMetadata;
		return { success: true, data };
	} catch (error: unknown) {
		logger.error(
			error instanceof Error ? error.message : JSON.stringify(error),
		);
		return {
			success: false,
			message: "Не вдалося звʼязатися з сервером. Спробуйте ще раз",
		};
	}
}
