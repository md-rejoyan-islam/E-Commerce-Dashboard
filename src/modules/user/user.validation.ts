import z from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    email: z.email(),
    password: z.string().min(6),
    phone: z.string().min(6).optional(),
    avatar: z.url().optional().or(z.string().min(1).optional()),
    role: z.enum(['superadmin', 'admin', 'user']).optional(),
    is_active: z.boolean().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      first_name: z.string().min(1).optional(),
      last_name: z.string().min(1).optional(),
      phone: z.string().min(6).optional(),
      avatar: z.url().optional().or(z.string().min(1).optional()),
      role: z.enum(['superadmin', 'admin', 'user']).optional(),
      is_active: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const changeStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ is_active: z.boolean() }),
});

export const changePasswordSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ password: z.string().min(6) }),
});

export const getUsersQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    role: z.enum(['superadmin', 'admin', 'user']).optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>['query'];
