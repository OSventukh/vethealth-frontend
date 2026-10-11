// Повідомлення редактору для помилок `POST /ai/seo-metadata`. Окремий модуль,
// бо з "use server"-файлу можна експортувати лише async-функції.
//
// Бекенд (див. backend/CLAUDE.md → "AI: генерація SEO-мета") кладе в тіло
// помилки стабільний `errorCode` — він точніший за статус: розводить
// відсутній і відхилений ключ (обидва 503) та ліміт провайдера і наш
// власний тротлер (обидва 429; у тротлера коду немає). Для відповідей без
// коду — запасний маппінг за статусом (див. STATUS_MESSAGES).

const ERROR_CODE_MESSAGES: Record<string, string> = {
	AI_NOT_CONFIGURED:
		"ШІ не налаштовано: додайте API-ключ провайдера в env бекенда",
	AI_KEY_REJECTED:
		"ШІ-провайдер відхилив API-ключ: перевірте ключ в env бекенда",
	AI_RATE_LIMITED:
		"Вичерпано ліміт запитів до ШІ-провайдера — зачекайте і спробуйте ще раз",
	AI_PROVIDER_ERROR: "ШІ-провайдер не відповів. Спробуйте ще раз",
	AI_INVALID_OUTPUT: "ШІ повернув некоректну відповідь. Спробуйте ще раз",
	AI_GENERATION_FAILED: "Не вдалося згенерувати мета-поля. Спробуйте ще раз",
	AI_TIMEOUT: "ШІ-провайдер не встиг відповісти вчасно. Спробуйте ще раз",
	// Масове SEO (`POST /seo/:type/:id/generate`): у матеріалі немає тексту.
	SEO_NO_CONTENT:
		"У матеріалі немає тексту — ШІ нема з чого генерувати. Заповніть вручну",
};

export const SESSION_EXPIRED_MESSAGE =
	"Сесія завершилась — увійдіть знову і повторіть генерацію";

const SERVER_UNAVAILABLE_MESSAGE =
	"Сервер тимчасово недоступний. Спробуйте за хвилину";

// Відповіді БЕЗ коду. Усі збої AI-сервісу бекенд позначає кодом, тож 5xx без
// нього прийшов не від ШІ, а від проксі/балансера (редеплой у Coolify,
// контейнер лежить) — радити тут «додайте API-ключ» було б неправдою.
// 429 без коду — наш власний тротлер бекенда (10 запитів/хв).
const STATUS_MESSAGES: Record<number, string> = {
	401: SESSION_EXPIRED_MESSAGE,
	429: "Забагато запитів — зачекайте хвилину і спробуйте ще раз",
	502: SERVER_UNAVAILABLE_MESSAGE,
	503: SERVER_UNAVAILABLE_MESSAGE,
	504: SERVER_UNAVAILABLE_MESSAGE,
};

const FALLBACK_MESSAGE = "Не вдалося згенерувати мета-поля. Спробуйте ще раз";

interface SeoErrorResponse {
	status: number;
	/** Розібране тіло відповіді (може бути будь-чим або відсутнім). */
	body?: unknown;
	/** Значення заголовка `Retry-After`, якщо бекенд його передав. */
	retryAfter?: string | null;
}

export function getErrorCode(body: unknown): string | undefined {
	if (body && typeof body === "object" && "errorCode" in body) {
		const { errorCode } = body as { errorCode: unknown };
		return typeof errorCode === "string" ? errorCode : undefined;
	}
	return undefined;
}

export function seoErrorMessage({
	status,
	body,
	retryAfter,
}: SeoErrorResponse): string {
	const errorCode = getErrorCode(body);

	// Провайдер сам сказав, коли повторити, — точніше за загальне «зачекайте».
	const seconds = Number(retryAfter);
	if (
		errorCode === "AI_RATE_LIMITED" &&
		Number.isInteger(seconds) &&
		seconds > 0
	) {
		return `Вичерпано ліміт запитів до ШІ-провайдера — спробуйте через ${seconds} с`;
	}

	return (
		// hasOwn — щоб код на кшталт "constructor" не дістав метод прототипу.
		(errorCode && Object.hasOwn(ERROR_CODE_MESSAGES, errorCode)
			? ERROR_CODE_MESSAGES[errorCode]
			: undefined) ||
		STATUS_MESSAGES[status] ||
		FALLBACK_MESSAGE
	);
}
