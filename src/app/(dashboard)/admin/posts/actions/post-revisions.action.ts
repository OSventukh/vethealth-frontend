"use server";
import { updateTag } from "next/cache";
import { TAGS } from "@/api/constants/tags";
import type {
	PostRevision,
	PostRevisionSummary,
} from "@/api/types/post-revisions.type";
import type { PostResponse } from "@/api/types/posts.type";
import { auth } from "@/lib/session/auth";
import logger from "@/logger";
import { SESSION_EXPIRED_MESSAGE } from "../../actions/seo-error-message";

type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; message: string };

const NETWORK_ERROR_MESSAGE =
	"Не вдалося звʼязатися з сервером. Спробуйте ще раз";

async function revisionsFetch(
	postId: string,
	path: string,
	init: RequestInit = {},
): Promise<Response | { error: string }> {
	const session = await auth();
	// Без токена бекенд гарантовано відповість 401 — не шлемо `Bearer undefined`.
	if (!session?.token) return { error: SESSION_EXPIRED_MESSAGE };
	const url = `${process.env.API_SERVER}/posts/${encodeURIComponent(postId)}/revisions${path}`;
	try {
		return await fetch(url, {
			...init,
			headers: { Authorization: `Bearer ${session.token}` },
			cache: "no-store",
		});
	} catch (error) {
		logger.error(
			`post revisions ${path || "/"}: ${error instanceof Error ? error.message : String(error)}`,
		);
		return { error: NETWORK_ERROR_MESSAGE };
	}
}

/** Тіло помилки може бути не-JSON (проксі, 502 від балансера). */
const readBody = (response: Response): Promise<unknown> =>
	response.json().catch(() => undefined);

const statusMessage = (status: number, fallback: string): string => {
	if (status === 401) return SESSION_EXPIRED_MESSAGE;
	if (status === 403) return "Недостатньо прав для історії цієї статті";
	if (status === 404) return "Версію не знайдено — можливо, її вже видалено";
	return fallback;
};

export async function listPostRevisionsAction(
	postId: string,
): Promise<ActionResult<PostRevisionSummary[]>> {
	const response = await revisionsFetch(postId, "");
	if ("error" in response) return { success: false, message: response.error };
	if (!response.ok) {
		logger.error(
			`listPostRevisionsAction: backend responded ${response.status}`,
		);
		return {
			success: false,
			message: statusMessage(
				response.status,
				"Не вдалося завантажити історію змін",
			),
		};
	}
	return {
		success: true,
		data: (await response.json()) as PostRevisionSummary[],
	};
}

export async function getPostRevisionAction(
	postId: string,
	revisionId: string,
): Promise<ActionResult<PostRevision>> {
	const response = await revisionsFetch(
		postId,
		`/${encodeURIComponent(revisionId)}`,
	);
	if ("error" in response) return { success: false, message: response.error };
	if (!response.ok) {
		return {
			success: false,
			message: statusMessage(response.status, "Не вдалося завантажити версію"),
		};
	}
	return { success: true, data: (await response.json()) as PostRevision };
}

export async function restorePostRevisionAction(
	postId: string,
	revisionId: string,
): Promise<ActionResult<PostResponse>> {
	const response = await revisionsFetch(
		postId,
		`/${encodeURIComponent(revisionId)}/restore`,
		{ method: "POST" },
	);
	if ("error" in response) return { success: false, message: response.error };
	if (!response.ok) {
		const body = (await readBody(response)) as
			| { errorCode?: string; post?: { title?: string } }
			| undefined;
		logger.error(
			`restorePostRevisionAction: backend responded ${response.status}`,
		);
		if (body?.errorCode === "POST_REVISION_CONFLICT") {
			return {
				success: false,
				message: `Заголовок або адресу цієї версії вже використовує стаття «${body.post?.title ?? "інша"}». Змініть її або оберіть іншу версію`,
			};
		}
		return {
			success: false,
			message: statusMessage(response.status, "Не вдалося відновити версію"),
		};
	}

	// Відновлення змінює опублікований контент так само, як звичайне збереження.
	updateTag(TAGS.POSTS);
	updateTag(TAGS.TOPICS);

	return { success: true, data: (await response.json()) as PostResponse };
}
