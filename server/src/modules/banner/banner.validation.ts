import z from 'zod';
import {
  fieldsSchema,
  is_activeSchema,
  paginationSchema,
  searchSchema,
} from '../../app/common-schema';
import BannerModel from './banner.model';

// Valid banner fields that can be requested
const validBannerFields = Object.keys(BannerModel.schema.paths);

// Banner type enum
const bannerTypeEnum = z.enum(['popup', 'slider', 'static'], {
  error: () => {
    throw new Error('Banner type must be one of: popup, slider, static');
  },
});

// Create banner schema
export const createBannerSchema = z.object({
  body: z.object({
    title: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Banner title is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Banner title must be a string';
          }
        },
      })
      .min(1, 'Banner title is required')
      .trim(),
    description: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Banner description is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Banner description must be a string';
          }
        },
      })
      .min(1, 'Banner description is required'),
    link: z
      .url({
        error: (iss) => {
          if (iss?.code === 'invalid_type') {
            return 'Banner link must be a valid URL';
          } else if (iss?.code === 'invalid_format') {
            return 'Banner link must be a valid URL';
          }
        },
      })
      .optional(),
    is_active: is_activeSchema.default('true'),
    type: bannerTypeEnum,
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
  }),
});

// Get banners query schema
export const getBannersQuerySchema = z.object({
  query: paginationSchema.extend({
    type: bannerTypeEnum.optional(),
    is_active: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('is_active must be true or false');
        },
      })
      .optional(),
    search: searchSchema,
    fields: fieldsSchema(validBannerFields),
  }),
});

// Get banner by ID schema
export const getBannerByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Banner ID is required'),
  }),
  query: z.object({
    fields: fieldsSchema(validBannerFields),
  }),
});

// Update banner schema
export const updateBannerSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Banner ID is required'),
  }),
  body: z.object({
    title: z
      .string({
        error: (iss) => {
          if (iss?.code === 'invalid_type') {
            return 'Banner title must be a string';
          }
        },
      })
      .min(1, 'Banner title is required')
      .trim()
      .optional(),
    description: z
      .string({
        error: (iss) => {
          if (iss?.code === 'invalid_type') {
            return 'Banner description must be a string';
          }
        },
      })
      .min(1, 'Banner description is required')
      .optional(),
    link: z
      .url({
        error: (iss) => {
          if (iss?.code === 'invalid_type') {
            return 'Banner link must be a valid URL';
          } else if (iss?.code === 'invalid_format') {
            return 'Banner link must be a valid URL';
          }
        },
      })
      .min(1, 'Banner link is required')
      .optional(),
    is_active: is_activeSchema,
    type: bannerTypeEnum.optional(),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
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
