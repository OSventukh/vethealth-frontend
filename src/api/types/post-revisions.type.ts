import type { PostMetadataResponse } from "./posts.type";

/** Дзеркало `PostRevisionReason` бекенда (`post-revision.entity.ts`). */
export type PostRevisionReason = "baseline" | "create" | "update" | "restore";

export interface PostRevisionEditor {
	id: string;
	firstname: string;
	lastname?: string | null;
}

/** SEO-поля metadata на момент збереження (без id/дат). */
export type PostRevisionMetadata = Partial<
	Omit<PostMetadataResponse, "id" | "createdAt" | "updatedAt">
> & { structuredData?: unknown };

/** Рядок списку історії — без `content` (бекенд його не віддає в списку). */
export interface PostRevisionSummary {
	id: string;
	postId: string;
	title: string;
	slug: string;
	status: string | null;
	reason: PostRevisionReason;
	restoredFromId: string | null;
	editorId: string | null;
	editor: PostRevisionEditor | null;
	createdAt: string;
}

export interface PostRevision extends PostRevisionSummary {
	content: string;
	metadata: PostRevisionMetadata | null;
	featuredImageFileId: string | null;
	featuredImageUrl: string | null;
}
