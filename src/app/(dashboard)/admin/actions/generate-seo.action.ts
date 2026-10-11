"use server";
import type { SeoDraft, SeoField } from "../seo/seo-fields";
import { auth } from "@/lib/session/auth";
import logger from "@/logger";
import {
	getErrorCode,
	SESSION_EXPIRED_MESSAGE,
	seoErrorMessage,
} from "./seo-error-message";

export type GeneratedSeoMetadata = SeoDraft;

export interface GenerateSeoInput {
	title: string;
	text: string;
	topics?: string[];
	entityType: "post" | "page";
	fields: SeoField[];
	current?: SeoDraft;
	hint?: string;
	primaryKeyword?: string;
	sourceTruncated?: boolean;
}

interface GenerateSeoResult {
	success: boolean;
	message?: string;
	data?: GeneratedSeoMetadata;
	warnings?: string[];
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
	if (!input.fields.length) return { success: true, data: {} };
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

		const { warnings, ...data } =
			(await response.json()) as GeneratedSeoMetadata & { warnings?: string[] };
		return { success: true, data, ...(warnings?.length ? { warnings } : {}) };
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
