import z from 'zod';
import {
  fieldsSchema,
  is_activeSchema,
  paginationSchema,
  searchSchema,
} from '../../app/common-schema';
import BrandModel from './brand.model';

// Valid brand fields that can be requested
const validBrandFields = Object.keys(BrandModel.schema.paths);

// Helper to handle boolean values from FormData (comes as string)
const booleanFromFormData = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((val) => (typeof val === 'string' ? val === 'true' : val))
  .optional();

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Brand name is required'),
    description: z.string().optional(),
    logo: z.string().url().optional().or(z.string().min(1).optional()),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly')
      .optional(),
    featured: booleanFromFormData,
    order: z.number().int().optional(),
    website: z.string().url().optional().or(z.string().min(1).optional()),
    is_active: booleanFromFormData,
  }),
});

export const updateBrandSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      logo: z.string().url().optional().or(z.string().min(1).optional()),
      slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly')
        .optional(),
      featured: booleanFromFormData,
      order: z.number().int().optional(),
      website: z.string().url().optional().or(z.string().min(1).optional()),
      is_active: booleanFromFormData,
      removeLogo: booleanFromFormData,
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const changeStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ is_active: z.boolean() }),
});

export const getBrandsQuerySchema = z.object({
  query: paginationSchema.extend({
    search: searchSchema,
    featured: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('featured must be true or false');
        },
      })
      .optional(),
    is_active: is_activeSchema,
    fields: fieldsSchema(validBrandFields),
  }),
});

export const getBrandByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Brand ID is required'),
  }),
  query: z.object({
    fields: fieldsSchema(validBrandFields),
  }),
});

export type GetBrandsQuery = z.infer<typeof getBrandsQuerySchema>['query'];
export type GetBrandByIdQuery = z.infer<typeof getBrandByIdSchema>['query'];
