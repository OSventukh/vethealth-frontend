import type {
	GenerateEntrySeoInput,
	GenerateEntrySeoResult,
} from "./actions/seo.action";
import type { SeoDraft } from "./seo-fields";

// Масовий прогін: матеріали по черзі, по одному запиту. Паралелити нема
// сенсу — і бекенд (30 генерацій/хв), і провайдер однаково обмежують
// частоту, а послідовно простіше показати прогрес і зупинитися.

export interface BulkTask {
	key: string;
	title: string;
	input: GenerateEntrySeoInput;
}

export interface BulkProgress {
	done: number;
	total: number;
	current?: string;
	/** Скільки ще чекаємо після 429, перш ніж повторити. */
	waitingSeconds?: number;
}

export interface BulkSummary {
	succeeded: number;
	failed: number;
	cancelled: boolean;
	/** Причина, з якої продовжувати безглуздо (сесія, ключ, права). */
	abortedWith?: string;
}

export interface BulkDeps {
	generate: (input: GenerateEntrySeoInput) => Promise<GenerateEntrySeoResult>;
	onSuccess: (task: BulkTask, data: SeoDraft, warnings?: string[]) => void;
	onError: (task: BulkTask, message: string) => void;
	onProgress: (progress: BulkProgress) => void;
	isCancelled: () => boolean;
	sleep?: (ms: number) => Promise<void>;
}

const MAX_RATE_LIMIT_RETRIES = 3;
const DEFAULT_WAIT_SECONDS = 30;
const MAX_WAIT_SECONDS = 120;

// Помилки, після яких наступні матеріали впадуть так само.
const FATAL_STATUSES = new Set([401, 403]);
const FATAL_CODES = new Set(["AI_NOT_CONFIGURED", "AI_KEY_REJECTED"]);

const defaultSleep = (ms: number) =>
	new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function runBulkGeneration(
	tasks: BulkTask[],
	{
		generate,
		onSuccess,
		onError,
		onProgress,
		isCancelled,
		sleep = defaultSleep,
	}: BulkDeps,
): Promise<BulkSummary> {
	const summary: BulkSummary = { succeeded: 0, failed: 0, cancelled: false };

	for (const [index, task] of tasks.entries()) {
		const progress = { done: index, total: tasks.length, current: task.title };

		for (let attempt = 0; ; attempt++) {
			if (isCancelled()) {
				summary.cancelled = true;
				return summary;
			}
			onProgress(progress);
			// Послідовність навмисна — див. коментар на початку файлу.
			// oxlint-disable-next-line no-await-in-loop
			const result = await generate(task.input);

			if (result.success && result.data) {
				onSuccess(task, result.data, result.warnings);
				summary.succeeded++;
				break;
			}

			const message = result.message ?? "Не вдалося згенерувати";
			if (
				(result.status && FATAL_STATUSES.has(result.status)) ||
				(result.errorCode && FATAL_CODES.has(result.errorCode))
			) {
				onError(task, message);
				summary.failed++;
				summary.abortedWith = message;
				return summary;
			}

			// 429 — і наш тротлер, і ліміт провайдера: чекаємо скільки
			// попросили (або пів хвилини) і пробуємо той самий матеріал знову.
			if (result.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
				const wait = Math.min(
					result.retryAfterSeconds ?? DEFAULT_WAIT_SECONDS,
					MAX_WAIT_SECONDS,
				);
				for (let left = Math.ceil(wait); left > 0; left--) {
					if (isCancelled()) {
						summary.cancelled = true;
						return summary;
					}
					onProgress({ ...progress, waitingSeconds: left });
					// oxlint-disable-next-line no-await-in-loop
					await sleep(1000);
				}
				continue;
			}

			onError(task, message);
			summary.failed++;
			break;
		}
	}

	onProgress({ done: tasks.length, total: tasks.length });
	return summary;
}
