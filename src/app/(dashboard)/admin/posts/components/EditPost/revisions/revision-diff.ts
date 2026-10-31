import type {
	PostRevision,
	PostRevisionReason,
	PostRevisionSummary,
} from "@/api/types/post-revisions.type";
import { extractLexicalText } from "@/lib/content-text";

/** Поточний стан форми редактора, з яким порівнюється версія. */
export interface RevisionComparable {
	title: string;
	slug: string;
	content: string;
	featuredImageFileId: string | null;
	featuredImageUrl: string | null;
	metaTitle: string;
	metaDescription: string;
}

export interface RevisionChange {
	field: string;
	label: string;
	/** Пояснення для контенту: на скільки слів відрізняється. */
	detail?: string;
}

export const REASON_LABELS: Record<PostRevisionReason, string> = {
	baseline: "Стан до появи історії",
	create: "Створено",
	update: "Збережено",
	restore: "Відновлено",
};

export const STATUS_LABELS: Record<string, string> = {
	Published: "Опубліковано",
	Draft: "Чернетка",
	OnReview: "На рецензії",
};

export function editorName(revision: PostRevisionSummary): string {
	if (revision.editor) {
		return (
			[revision.editor.firstname, revision.editor.lastname]
				.filter(Boolean)
				.join(" ") || "Без імені"
		);
	}
	// Baseline знято автоматично; в інших випадках користувача видалили.
	return revision.reason === "baseline" ? "—" : "Видалений користувач";
}

export function formatRevisionDate(iso: string): string {
	return new Date(iso).toLocaleString("uk-UA", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

const norm = (value?: string | null) => (value ?? "").trim();

function countWords(text: string): number {
	return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Що зміниться у формі, якщо відновити цю версію. Контент порівнюється за
 * текстом: серіалізація Lexical у редакторі може відрізнятися від збереженої
 * побайтово, а редактору важливо, чи змінився саме текст.
 */
export function diffRevision(
	revision: PostRevision,
	current: RevisionComparable,
): RevisionChange[] {
	const changes: RevisionChange[] = [];

	if (norm(revision.title) !== norm(current.title)) {
		changes.push({ field: "title", label: "Заголовок" });
	}
	if (norm(revision.slug) !== norm(current.slug)) {
		changes.push({ field: "slug", label: "Адреса (slug)" });
	}

	const revisionText = extractLexicalText(revision.content);
	const currentText = extractLexicalText(current.content);
	if (revisionText.trim() !== currentText.trim()) {
		const delta = countWords(revisionText) - countWords(currentText);
		changes.push({
			field: "content",
			label: "Текст статті",
			detail:
				delta === 0
					? "та сама кількість слів"
					: `${delta > 0 ? "+" : "−"}${Math.abs(delta)} слів відносно поточного`,
		});
	} else if (norm(revision.content) !== norm(current.content)) {
		// Текст той самий, але змінилось щось інше: картинки, діаграми, форматування.
		changes.push({
			field: "content",
			label: "Оформлення статті",
			detail: "картинки, діаграми або форматування",
		});
	}

	const revisionImage =
		revision.featuredImageFileId ?? revision.featuredImageUrl;
	const currentImage = current.featuredImageFileId ?? current.featuredImageUrl;
	if (norm(revisionImage) !== norm(currentImage)) {
		changes.push({ field: "image", label: "Обкладинка" });
	}

	if (
		revision.metadata &&
		(norm(revision.metadata.metaTitle) !== norm(current.metaTitle) ||
			norm(revision.metadata.metaDescription) !== norm(current.metaDescription))
	) {
		changes.push({ field: "seo", label: "SEO-заголовок або опис" });
	}

	return changes;
}

export function parseRevisionContent(content: string): unknown | null {
	try {
		return JSON.parse(content);
	} catch {
		return null;
	}
}
