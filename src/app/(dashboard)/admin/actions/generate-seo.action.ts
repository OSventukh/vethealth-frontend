"use server";
import { auth } from "@/lib/session/auth";
import logger from "@/logger";
import {
	getErrorCode,
	SESSION_EXPIRED_MESSAGE,
	seoErrorMessage,
} from "./seo-error-message";

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

// Трохи довше за 30-секундний таймаут генерації на бекенді, щоб штатно
// отримати від нього 504, а не обірвати з'єднання першими.
const REQUEST_TIMEOUT_MS = 45000;

export async function generateSeoAction(
	input: GenerateSeoInput,
): Promise<GenerateSeoResult> {
	const session = await auth();
	// Без токена бекенд гарантовано відповість 401 — не шлемо `Bearer undefined`.
	if (!session?.token) {
		return { success: false, message: SESSION_EXPIRED_MESSAGE };
	}
	try {
		const response = await fetch(`${process.env.API_SERVER}/ai/seo-metadata`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session.token}`,
			},
			body: JSON.stringify(input),
			cache: "no-store",
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});

		if (!response.ok) {
			// Тіло помилки може бути не-JSON (проксі, 502 від балансера) —
			// тоді лишаємося зі статусом.
			const body: unknown = await response.json().catch(() => undefined);
			const errorCode = getErrorCode(body);
			logger.error(
				`generateSeoAction: backend responded ${response.status}${errorCode ? ` ${errorCode}` : ""} for "${input.title}"`,
			);
			return {
				success: false,
				message: seoErrorMessage({
					status: response.status,
					body,
					retryAfter: response.headers.get("Retry-After"),
				}),
			};
		}

		const data = (await response.json()) as GeneratedSeoMetadata;
		return { success: true, data };
	} catch (error: unknown) {
		logger.error(
			error instanceof Error ? error.message : JSON.stringify(error),
		);
		const isTimeout =
			error instanceof Error &&
			(error.name === "TimeoutError" || error.name === "AbortError");
		return {
			success: false,
			message: isTimeout
				? "ШІ-провайдер довго не відповідає. Спробуйте ще раз"
				: "Не вдалося звʼязатися з сервером. Спробуйте ще раз",
		};
	}
}
