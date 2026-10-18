"use server";

import {
	getErrorCode,
	SESSION_EXPIRED_MESSAGE,
	seoErrorMessage,
} from "@/app/(dashboard)/admin/actions/seo-error-message";
import type { Pagination } from "@/api/types/general.type";
import type {
	MediaDetails,
	MediaItem,
	MediaUsage,
} from "@/api/types/media.type";
import { auth } from "@/lib/session/auth";
import logger from "@/logger";

// Трохи довше за 30-секундний таймаут генерації на бекенді, щоб штатно
// отримати від нього 504, а не обірвати з'єднання першими.
const GENERATE_TIMEOUT_MS = 45000;

const NETWORK_ERROR_MESSAGE =
	"Не вдалося звʼязатися з сервером. Спробуйте ще раз";

type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; message: string };

export interface MediaListQuery {
	page?: number;
	/** Зсув замість `page` — для довантаження. */
	offset?: number;
	size?: number;
	search?: string;
	missingAlt?: boolean;
	/** Лише файли, що ніде не використовуються. */
	unused?: boolean;
	/** Лише зображення, вужчі за цю ширину (px). */
	narrowerThan?: number;
}

async function mediaFetch(
	path: string,
	init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response | { error: string; status?: number }> {
	const session = await auth();
	// Без токена бекенд гарантовано відповість 401 — не шлемо `Bearer undefined`.
	if (!session?.token) return { error: SESSION_EXPIRED_MESSAGE, status: 401 };
	const { timeoutMs, ...rest } = init;
	try {
		return await fetch(`${process.env.API_SERVER}/media${path}`, {
			...rest,
			headers: {
				...(rest.body ? { "Content-Type": "application/json" } : {}),
				Authorization: `Bearer ${session.token}`,
			},
			cache: "no-store",
			...(timeoutMs ? { signal: AbortSignal.timeout(timeoutMs) } : {}),
		});
	} catch (error) {
		logger.error(
			`media${path}: ${error instanceof Error ? error.message : String(error)}`,
		);
		const isTimeout =
			error instanceof Error &&
			(error.name === "TimeoutError" || error.name === "AbortError");
		return {
			error: isTimeout
				? "ШІ-провайдер довго не відповідає. Спробуйте ще раз"
				: NETWORK_ERROR_MESSAGE,
		};
	}
}

/** Тіло помилки може бути не-JSON (проксі, 502 від балансера). */
const readBody = (response: Response): Promise<unknown> =>
	response.json().catch(() => undefined);

export async function listMediaAction(
	query: MediaListQuery = {},
): Promise<ActionResult<Pagination<MediaItem>>> {
	const params = new URLSearchParams();
	if (query.page) params.set("page", String(query.page));
	if (query.offset !== undefined) params.set("offset", String(query.offset));
	if (query.size) params.set("size", String(query.size));
	if (query.search?.trim()) params.set("search", query.search.trim());
	if (query.missingAlt) params.set("missingAlt", "true");
	if (query.unused) params.set("unused", "true");
	if (query.narrowerThan)
		params.set("narrowerThan", String(query.narrowerThan));

	const response = await mediaFetch(`?${params}`);
	if ("error" in response) return { success: false, message: response.error };
	if (!response.ok) {
		logger.error(`listMediaAction: backend responded ${response.status}`);
		return { success: false, message: "Не вдалося завантажити медіатеку" };
	}
	return {
		success: true,
		data: (await response.json()) as Pagination<MediaItem>,
	};
}

export async function getMediaAction(
	id: string,
): Promise<ActionResult<MediaDetails>> {
	const response = await mediaFetch(`/${encodeURIComponent(id)}`);
	if ("error" in response) return { success: false, message: response.error };
	if (!response.ok) {
		return {
			success: false,
			message:
				response.status === 404
					? "Файл не знайдено — можливо, його вже видалили"
					: "Не вдалося завантажити дані файлу",
		};
	}
	return { success: true, data: (await response.json()) as MediaDetails };
}

export async function updateMediaAltAction(
	id: string,
	alt: string,
): Promise<ActionResult<MediaItem>> {
	const response = await mediaFetch(`/${encodeURIComponent(id)}`, {
		method: "PATCH",
		body: JSON.stringify({ alt }),
	});
	if ("error" in response) return { success: false, message: response.error };
	if (!response.ok) {
		logger.error(`updateMediaAltAction: backend responded ${response.status}`);
		return { success: false, message: "Не вдалося зберегти alt-текст" };
	}
	return { success: true, data: (await response.json()) as MediaItem };
}

/** Для масового прогону: на 429 він чекає й повторює, на 401/ключі — зупиняється. */
export type GenerateAltResult =
	| { success: true; data: { alt: string } }
	| {
			success: false;
			message: string;
			status?: number;
			errorCode?: string;
			retryAfterSeconds?: number;
	  };

export async function generateMediaAltAction(
	id: string,
	options: { current?: string; hint?: string } = {},
): Promise<GenerateAltResult> {
	const response = await mediaFetch(`/${encodeURIComponent(id)}/alt/generate`, {
		method: "POST",
		body: JSON.stringify(options),
		timeoutMs: GENERATE_TIMEOUT_MS,
	});
	if ("error" in response) {
		return { success: false, message: response.error, status: response.status };
	}
	if (!response.ok) {
		const body = await readBody(response);
		const errorCode = getErrorCode(body);
		const retryAfter = response.headers.get("Retry-After");
		logger.error(
			`generateMediaAltAction: backend responded ${response.status}${errorCode ? ` ${errorCode}` : ""} for ${id}`,
		);
		return {
			success: false,
			status: response.status,
			errorCode,
			retryAfterSeconds: Number(retryAfter) || undefined,
			message: seoErrorMessage({
				status: response.status,
				body,
				retryAfter,
				fallback: "Не вдалося згенерувати alt-текст. Спробуйте ще раз",
			}),
		};
	}
	return { success: true, data: (await response.json()) as { alt: string } };
}

export type DeleteMediaResult =
	| { success: true }
	| { success: false; message: string; usages?: MediaUsage[] };

/**
 * Без `force` бекенд відмовляє (409 + `usages`), якщо файл десь використовується —
 * тоді форма показує список і просить підтвердити ще раз.
 */
export async function deleteMediaAction(
	id: string,
	force = false,
): Promise<DeleteMediaResult> {
	const response = await mediaFetch(
		`/${encodeURIComponent(id)}${force ? "?force=true" : ""}`,
		{ method: "DELETE" },
	);
	if ("error" in response) return { success: false, message: response.error };
	if (response.ok) return { success: true };

	const body = await readBody(response);
	if (response.status === 409 && getErrorCode(body) === "MEDIA_IN_USE") {
		return {
			success: false,
			message: "Файл використовується в матеріалах",
			usages: (body as { usages?: MediaUsage[] }).usages ?? [],
		};
	}
	logger.error(`deleteMediaAction: backend responded ${response.status}`);
	return {
		success: false,
		message:
			response.status === 403
				? "Видаляти файли можуть лише адміністратори"
				: "Не вдалося видалити файл",
	};
}

export interface BulkDeleteMediaResult {
	deleted: string[];
	/** Пропущені, бо використовуються (лише без `force`). */
	inUse: { id: string; usages: MediaUsage[] }[];
}

export async function bulkDeleteMediaAction(
	ids: string[],
	force = false,
): Promise<ActionResult<BulkDeleteMediaResult>> {
	const response = await mediaFetch("/bulk-delete", {
		method: "POST",
		body: JSON.stringify({ ids, force }),
	});
	if ("error" in response) return { success: false, message: response.error };
	if (!response.ok) {
		logger.error(`bulkDeleteMediaAction: backend responded ${response.status}`);
		return {
			success: false,
			message:
				response.status === 403
					? "Видаляти файли можуть лише адміністратори"
					: "Не вдалося видалити файли",
		};
	}
	return {
		success: true,
		data: (await response.json()) as BulkDeleteMediaResult,
	};
}
