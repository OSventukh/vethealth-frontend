"use server";
import { updateTag } from "next/cache";
import { TAGS } from "@/api/constants/tags";
import { auth } from "@/lib/session/auth";
import logger from "@/logger";
import {
	getErrorCode,
	SESSION_EXPIRED_MESSAGE,
	seoErrorMessage,
} from "../../actions/seo-error-message";
import type {
	SeoDraft,
	SeoEntityType,
	SeoField,
	SeoValues,
} from "../seo-fields";

// Трохи довше за 30-секундний таймаут генерації на бекенді, щоб штатно
// отримати від нього 504, а не обірвати з'єднання першими.
const GENERATE_TIMEOUT_MS = 45000;

// Після збереження мета видно на публічних сторінках матеріалу; тема ще й
// впливає на сторінки, що її показують.
const TAGS_BY_TYPE: Record<SeoEntityType, string[]> = {
	post: [TAGS.POSTS],
	page: [TAGS.PAGES],
	topic: [TAGS.TOPICS],
};

interface EntryRef {
	type: SeoEntityType;
	id: string;
}

export interface GenerateEntrySeoInput extends EntryRef {
	fields?: SeoField[];
	current?: SeoDraft;
	hint?: string;
	primaryKeyword?: string;
}

export interface GenerateEntrySeoResult {
	success: boolean;
	data?: SeoDraft;
	warnings?: string[];
	message?: string;
	/** Для масового прогону: на 429 він чекає і повторює, а не здається. */
	status?: number;
	errorCode?: string;
	retryAfterSeconds?: number;
}

export async function generateEntrySeoAction({
	type,
	id,
	...options
}: GenerateEntrySeoInput): Promise<GenerateEntrySeoResult> {
	const session = await auth();
	if (!session?.token) {
		return { success: false, status: 401, message: SESSION_EXPIRED_MESSAGE };
	}
	try {
		const response = await fetch(
			`${process.env.API_SERVER}/seo/${type}/${id}/generate`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.token}`,
				},
				body: JSON.stringify(options),
				cache: "no-store",
				signal: AbortSignal.timeout(GENERATE_TIMEOUT_MS),
			},
		);

		if (!response.ok) {
			const body: unknown = await response.json().catch(() => undefined);
			const errorCode = getErrorCode(body);
			// Ліміт провайдера бекенд пересилає як `Retry-After`, а власний
			// тротлер Nest (іменований `api`) пише суфіксований `Retry-After-api`.
			const retryAfter =
				response.headers.get("Retry-After") ??
				response.headers.get("Retry-After-api");
			logger.error(
				`generateEntrySeoAction: backend responded ${response.status}${errorCode ? ` ${errorCode}` : ""} for ${type} ${id}`,
			);
			const seconds = Number(retryAfter);
			return {
				success: false,
				status: response.status,
				errorCode,
				retryAfterSeconds:
					Number.isFinite(seconds) && seconds > 0 ? seconds : undefined,
				message: seoErrorMessage({
					status: response.status,
					body,
					retryAfter,
				}),
			};
		}

		const { warnings, ...data } = (await response.json()) as SeoDraft & {
			warnings?: string[];
		};
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

export interface SaveEntrySeoInput extends EntryRef {
	/** Лише змінені поля; порожній рядок очищає поле. */
	values: SeoDraft;
}

export interface SaveEntrySeoResult {
	success: boolean;
	data?: SeoValues;
	message?: string;
}

export async function saveEntrySeoAction({
	type,
	id,
	values,
}: SaveEntrySeoInput): Promise<SaveEntrySeoResult> {
	const session = await auth();
	if (!session?.token) {
		return { success: false, message: SESSION_EXPIRED_MESSAGE };
	}
	try {
		const response = await fetch(
			`${process.env.API_SERVER}/seo/${type}/${id}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.token}`,
				},
				body: JSON.stringify(values),
				cache: "no-store",
			},
		);
		const body: unknown = await response.json().catch(() => undefined);

		if (!response.ok) {
			logger.error(
				`saveEntrySeoAction: backend responded ${response.status} for ${type} ${id}: ${JSON.stringify(body)}`,
			);
			return {
				success: false,
				message:
					response.status === 401
						? SESSION_EXPIRED_MESSAGE
						: "Не вдалося зберегти. Перевірте довжину полів і спробуйте ще раз",
			};
		}

		for (const tag of TAGS_BY_TYPE[type]) {
			updateTag(tag);
		}
		return { success: true, data: body as SeoValues };
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
