import { z } from "zod";

const relativeSchema = z.object({
	id: z.string(),
});

export const createTopicSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Назва повинна мати не менше 3 символів" }),
	description: z
		.string()
		.min(5, { message: "Опис повинний мати не менше 5 символів" })
		.optional()
		.or(z.literal("")),
	slug: z.string().min(2, { message: "URL повинний мати не менше 2 символів" }),
	image: z.object({
		id: z.string(),
		path: z.string(),
	}),
	contentType: z.enum(["post", "page"]),
	status: relativeSchema,
	categories: z.array(relativeSchema).optional(),
	page: relativeSchema.optional(),
	parent: relativeSchema
		.nullable()
		.or(z.null())
		.transform((value) => (value?.id === "null" ? null : value)),
});

export type TopicValues = z.infer<typeof createTopicSchema>;

export const createCategorySchema = z.object({
	name: z
		.string()
		.min(3, { message: "Назва повинна мати не менше 3 символів" }),
	slug: z.string().min(2, { message: "URL повинний мати не менше 2 символів" }),
	parent: relativeSchema
		.nullable()
		.or(z.null())
		.transform((value) => (value?.id === "null" ? null : value)),
});

export type CategoryValues = z.infer<typeof createCategorySchema>;

export const postMetadataSchema = z.object({
	metaTitle: z
		.string()
		.max(70, { message: "Не більше 70 символів" })
		.optional()
		.or(z.literal("")),
	metaDescription: z
		.string()
		.max(180, { message: "Не більше 180 символів" })
		.optional()
		.or(z.literal("")),
	metaKeywords: z.string().optional().or(z.literal("")),
	ogTitle: z.string().optional().or(z.literal("")),
	ogDescription: z.string().optional().or(z.literal("")),
	ogImage: z.string().optional().or(z.literal("")),
	twitterCard: z.enum(["summary", "summary_large_image"]),
	canonicalUrl: z
		.string()
		.url({ message: "Невірний формат URL" })
		.optional()
		.or(z.literal("")),
	indexable: z.boolean(),
	followable: z.boolean(),
});

export const createPostSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Назва повинна мати не менше 3 символів" })
		.max(80, { message: "Не більше 80 символів" }),
	slug: z.string().optional().or(z.literal("")),
	content: z.string(),
	featuredImageFile: z
		.object({
			id: z.string(),
			path: z.string(),
		})
		.nullable()
		.optional(),
	featuredImageUrl: z.string().optional().or(z.literal("")).nullable(),
	topics: z.array(relativeSchema),
	categories: z.array(relativeSchema),
	metadata: postMetadataSchema,
});

export type PostValues = z.infer<typeof createPostSchema>;

export const createUserSchema = z.object({
	firstname: z
		.string()
		.min(2, { message: "Ім'я повинне мати не менше 2 символів" }),
	lastname: z
		.string()
		.min(2, { message: "Прізвище повинне мати не менше 2 символів" })
		.optional()
		.or(z.literal("")),
	email: z.string().email({ message: "Невірний формат пошти" }),
	role: relativeSchema.optional(),
	status: relativeSchema.optional().or(z.null()),
	topics: z.array(relativeSchema).optional(),
});

export type UserValues = z.infer<typeof createUserSchema>;

export const loginSchema = z.object({
	email: z
		.string({
			error: (issue) =>
				issue.input === undefined ? "Введіть емейл" : undefined,
		})
		.email({ error: "Невірний формат пошти" }),
	password: z
		.string({
			error: (issue) =>
				issue.input === undefined ? "Введіть пароль" : undefined,
		})
		.min(6, { error: "Пароль повинен мати не менше 6 символів" }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const confirmationSchema = z
	.object({
		hash: z.string(),
		email: z.string(),
		password: z
			.string({
				error: (issue) =>
					issue.input === undefined ? "Введіть пароль" : undefined,
			})
			.min(6, { error: "Пароль повинен мати не менше 6 символів" }),
		confirmPassword: z
			.string({
				error: (issue) =>
					issue.input === undefined ? "Підтвердіть пароль" : undefined,
			})
			.min(6, { error: "Пароль повинен мати не менше 6 символів" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Паролі не співпадають",
		path: ["confirmPassword"],
	});

export type ConfirmationValues = z.infer<typeof confirmationSchema>;

export const updatePasswordSchema = z
	.object({
		email: z.string(),
		password: z
			.string({
				error: (issue) =>
					issue.input === undefined ? "Введіть пароль" : undefined,
			})
			.min(6, { error: "Пароль повинен мати не менше 6 символів" }),
		confirmPassword: z
			.string({
				error: (issue) =>
					issue.input === undefined ? "Підтвердіть пароль" : undefined,
			})
			.min(6, { error: "Пароль повинен мати не менше 6 символів" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Паролі не співпадають",
		path: ["confirmPassword"],
	});

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export const forgotSchema = z.object({
	email: z
		.string({
			error: (issue) =>
				issue.input === undefined ? "Введіть емейл" : undefined,
		})
		.email({ error: "Невірний формат пошти" }),
});

export type ForgotValues = z.infer<typeof forgotSchema>;

export const searchSchema = z.object({
	query: z.string().optional().or(z.literal("")),
});

export type SearchValues = z.infer<typeof searchSchema>;
