import type { z } from "zod";

import type { postQuerySchema } from "@/utils/validators/query.validator";
import type { CategoryResponse } from "./categories.type";
import type { TopicResponse } from "./topics.type";

export type PostMetadataResponse = {
	id: string;
	metaTitle?: string | null;
	metaDescription?: string | null;
	metaKeywords?: string | null;
	ogTitle?: string | null;
	ogDescription?: string | null;
	ogImage?: string | null;
	ogType?: string | null;
	twitterTitle?: string | null;
	twitterDescription?: string | null;
	twitterImage?: string | null;
	twitterCard?: string | null;
	canonicalUrl?: string | null;
	indexable: boolean;
	followable: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type PostResponse = {
	id: string;
	title: string;
	content: string;
	slug: string;
	featuredImage: string | null;
	featuredImageFile?: {
		id: string;
		path: string;
	} | null;
	featuredImageUrl?: string | null;
	createdAt: string;
	updatedAt?: string;
	status?: "Draft" | "Published" | "OnReview";
	topics?: TopicResponse[];
	categories?: CategoryResponse[];
	metadata?: PostMetadataResponse | null;
};

export type PostGetOneParams = {
	slug: string;
	token?: string;
	query?: z.infer<typeof postQuerySchema>;
	revalidate?: number | false;
	tags?: string[];
};

export type PostGetManyParams = {
	token?: string;
	query?: z.infer<typeof postQuerySchema>;
	revalidate?: number | false;
	tags?: string[];
};
