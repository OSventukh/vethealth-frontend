import type { z } from "zod";

import type { postQuerySchema } from "@/utils/validators/query.validator";

export type PageMetadataResponse = {
	id: string;
	metaTitle: string | null;
	metaDescription: string | null;
	metaKeywords: string | null;
	ogImage: string | null;
	canonicalUrl: string | null;
	indexable: boolean;
	followable: boolean;
};

export type PageResponse = {
	id: string;
	title: string;
	content: string;
	slug: string;
	featuredImage: string | null;
	createdAt: string;
	updatedAt?: string;
	status?: "Draft" | "Published" | "OnReview";
	metadata?: PageMetadataResponse | null;
};

export type PageGetOneParams = {
	slug: string;
	token?: string;
	query?: z.infer<typeof postQuerySchema>;
	revalidate?: number | false;
	tags?: string[];
};

export type PageGetManyParams = {
	token?: string;
	query?: z.infer<typeof postQuerySchema>;
	revalidate?: number | false;
	tags?: string[];
};
