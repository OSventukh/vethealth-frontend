import { z } from 'zod';

const relativeSchema = z.object({
  id: z.string(),
});

export const createTopicSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Назва повинна мати не менше 3 символів' }),
  description: z
    .string()
    .min(5, { message: 'Опис повинний мати не менше 5 символів' })
    .optional()
    .or(z.literal('')),
  slug: z.string().min(2, { message: 'URL повинний мати не менше 2 символів' }),
  image: z.object({
    id: z.string(),
    path: z.string(),
  }),
  contentType: z.enum(['post', 'page']),
  status: relativeSchema,
  categories: z.array(relativeSchema).optional(),
  page: relativeSchema.optional(),
  parent: relativeSchema
    .optional()
    .or(z.null())
    .transform((value) => (value?.id === 'null' ? null : value)),
});

export type TopicValues = z.infer<typeof createTopicSchema>;

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Назва повинна мати не менше 3 символів' }),
  slug: z.string().min(2, { message: 'URL повинний мати не менше 2 символів' }),
  parent: relativeSchema
    .optional()
    .or(z.null())
    .transform((value) => (value?.id === 'null' ? null : value)),
});

export type CategoryValues = z.infer<typeof createCategorySchema>;

export const createUserSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "Ім'я повинне мати не менше 2 символів" }),
  lastname: z
    .string()
    .min(2, { message: 'Прізвище повинне мати не менше 2 символів' })
    .optional()
    .or(z.literal('')),
  email: z.string().email({ message: 'Невірний формат пошти' }),
  role: relativeSchema.optional(),
  status: relativeSchema.optional().or(z.null()),
  topics: z.array(relativeSchema).optional(),
});

export type UserValues = z.infer<typeof createUserSchema>;

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Введіть емейл' })
    .email({ message: 'Невірний формат пошти' }),
  password: z
    .string({ required_error: 'Введіть пароль' })
    .min(6, { message: 'Пароль повинен мати не менше 6 символів' }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const confirmationSchema = z
  .object({
    hash: z.string(),
    email: z.string(),
    password: z
      .string({ required_error: 'Введіть пароль' })
      .min(6, { message: 'Пароль повинен мати не менше 8 символів' }),
    confirmPassword: z
      .string({ required_error: 'Підтвердіть пароль' })
      .min(6, { message: 'Пароль повинен мати не менше 8 символів' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

export type ConfirmationValues = z.infer<typeof confirmationSchema>;

export const updatePasswordSchema = z
  .object({
    email: z.string(),
    password: z
      .string({ required_error: 'Введіть пароль' })
      .min(6, { message: 'Пароль повинен мати не менше 8 символів' }),
    confirmPassword: z
      .string({ required_error: 'Підтвердіть пароль' })
      .min(6, { message: 'Пароль повинен мати не менше 8 символів' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export const forgotSchema = z.object({
  email: z
    .string({ required_error: 'Введіть емейл' })
    .email({ message: 'Невірний формат пошти' }),
});

export type ForgotValues = z.infer<typeof forgotSchema>;
