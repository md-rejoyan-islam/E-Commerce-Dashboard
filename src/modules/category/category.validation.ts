import z from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    description: z.string().optional(),
    image: z.url().optional().or(z.string().min(1).optional()),
    parent_id: z.string().optional(),
    featured: z.boolean().optional(),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly')
      .optional(),
    order: z.number().int().optional(),
    is_active: z.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      image: z.url().optional().or(z.string().min(1).optional()),
      parent_id: z.string().optional(),
      featured: z.boolean().optional(),
      slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly')
        .optional(),
      order: z.number().int().optional(),
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

export const getCategoryByIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  query: z.object({
    includeParent: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeParent must be true or false');
        },
      })
      .optional(),
  }),
});

export const getCategoriesQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    includeParent: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeParent must be true or false');
        },
      })
      .optional(),
    featured: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('featured must be true or false');
        },
      })
      .optional(),
    is_active: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('is_active must be true or false');
        },
      })
      .optional(),
    parent_id: z.string().optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export type GetCategoriesQuery = z.infer<
  typeof getCategoriesQuerySchema
>['query'];
