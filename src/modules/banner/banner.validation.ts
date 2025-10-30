import z from 'zod';
import BannerModel from './banner.model';

// Valid banner fields that can be requested
const validBannerFields = Object.keys(BannerModel.schema.paths);

// Banner type enum
const bannerTypeEnum = z.enum(['popup', 'slider', 'static']);

// Create banner schema
export const createBannerSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Banner title is required').trim(),
    description: z.string().min(1, 'Banner description is required'),
    image: z.string().min(1, 'Banner image is required'),
    link: z.string().min(1, 'Banner link is required'),
    is_active: z.boolean().optional().default(true),
    type: bannerTypeEnum,
  }),
});

// Get banners query schema
export const getBannersQuerySchema = z.object({
  query: z.object({
    type: bannerTypeEnum.optional(),
    is_active: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('is_active must be true or false');
        },
      })
      .optional(),
    search: z.string().optional(),
    fields: z
      .string()
      .optional()
      .refine(
        (fields) => {
          if (!fields) return true;
          const requestedFields = fields
            .split(',')
            .map((f: string) => f.trim());
          const invalidFields = requestedFields.filter(
            (field: string) => !validBannerFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validBannerFields.join(', ')}`,
        },
      ),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  }),
});

// Get banner by ID schema
export const getBannerByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Banner ID is required'),
  }),
  query: z.object({
    fields: z
      .string()
      .optional()
      .refine(
        (fields) => {
          if (!fields) return true;
          const requestedFields = fields
            .split(',')
            .map((f: string) => f.trim());
          const invalidFields = requestedFields.filter(
            (field: string) => !validBannerFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validBannerFields.join(', ')}`,
        },
      ),
  }),
});

// Update banner schema
export const updateBannerSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Banner ID is required'),
  }),
  body: z.object({
    title: z.string().min(1, 'Banner title is required').trim().optional(),
    description: z.string().min(1, 'Banner description is required').optional(),
    image: z.string().min(1, 'Banner image is required').optional(),
    link: z.string().min(1, 'Banner link is required').optional(),
    is_active: z.boolean().optional(),
    type: bannerTypeEnum.optional(),
  }),
});

// Update banner status schema
export const updateBannerStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Banner ID is required'),
  }),
  body: z.object({
    is_active: z.boolean({
      message: 'is_active must be a boolean',
    }),
  }),
});

// Delete banner schema
export const deleteBannerSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Banner ID is required'),
  }),
});

export type CreateBannerBody = z.infer<typeof createBannerSchema>['body'];
export type GetBannersQuery = z.infer<typeof getBannersQuerySchema>['query'];
export type GetBannerByIdParams = z.infer<typeof getBannerByIdSchema>['params'];
export type GetBannerByIdQuery = z.infer<typeof getBannerByIdSchema>['query'];
export type UpdateBannerParams = z.infer<typeof updateBannerSchema>['params'];
export type UpdateBannerBody = z.infer<typeof updateBannerSchema>['body'];
export type UpdateBannerStatusParams = z.infer<
  typeof updateBannerStatusSchema
>['params'];
export type UpdateBannerStatusBody = z.infer<
  typeof updateBannerStatusSchema
>['body'];
export type DeleteBannerParams = z.infer<typeof deleteBannerSchema>['params'];
