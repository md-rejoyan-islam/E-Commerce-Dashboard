import z from 'zod';
import CampaignModel from './campaign.model';

// Valid campaign fields that can be requested
const validCampaignFields = Object.keys(CampaignModel.schema.paths);

// Discount type enum
const discountTypeEnum = z.enum(['percentage', 'fixed_amount']);

// Create campaign schema
export const createCampaignSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Campaign name is required').trim(),
    description: z.string().min(1, 'Campaign description is required'),
    image: z.string().min(1, 'Campaign image is required'),
    start_date: z.coerce.date({
      message: 'Start date is required',
    }),
    end_date: z.coerce.date({
      message: 'End date is required',
    }),
    discount_type: discountTypeEnum,
    discount_value: z
      .number({
        message: 'Discount value is required',
      })
      .min(0, 'Discount value must be greater than or equal to 0'),
    applies_to: z.object({
      all_products: z.boolean().default(false),
      productsIds: z.array(z.string()).optional(),
      categoryIds: z.array(z.string()).optional(),
      brandIds: z.array(z.string()).optional(),
    }),
    minimum_purchase_amount: z
      .number()
      .min(0, 'Minimum purchase amount must be greater than or equal to 0')
      .default(0)
      .optional(),
    free_shipping: z.boolean().default(false).optional(),
    usage_limit: z
      .number()
      .min(0, 'Usage limit must be greater than or equal to 0')
      .default(0)
      .optional(),
    is_active: z.boolean().default(true).optional(),
  }),
});

// Get campaigns query schema
export const getCampaignsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    is_active: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('is_active must be true or false');
        },
      })
      .optional(),
    includeProducts: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeProducts must be true or false');
        },
      })
      .optional(),
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
            (field: string) => !validCampaignFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validCampaignFields.join(', ')}`,
        },
      ),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  }),
});

// Get campaign by ID schema
export const getCampaignByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Campaign ID is required'),
  }),
  query: z.object({
    includeProducts: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeProducts must be true or false');
        },
      })
      .optional(),
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
            (field: string) => !validCampaignFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validCampaignFields.join(', ')}`,
        },
      ),
  }),
});

// Update campaign schema
export const updateCampaignSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Campaign ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Campaign name is required').trim().optional(),
    description: z
      .string()
      .min(1, 'Campaign description is required')
      .optional(),
    image: z.string().min(1, 'Campaign image is required').optional(),
    start_date: z.coerce
      .date({
        message: 'Invalid start date format',
      })
      .optional(),
    end_date: z.coerce
      .date({
        message: 'Invalid end date format',
      })
      .optional(),
    discount_type: discountTypeEnum.optional(),
    discount_value: z
      .number({
        message: 'Discount value must be a number',
      })
      .min(0, 'Discount value must be greater than or equal to 0')
      .optional(),
    applies_to: z
      .object({
        all_products: z.boolean().default(false),
        productsIds: z.array(z.string()).optional(),
        categoryIds: z.array(z.string()).optional(),
        brandIds: z.array(z.string()).optional(),
      })
      .optional(),
    minimum_purchase_amount: z
      .number()
      .min(0, 'Minimum purchase amount must be greater than or equal to 0')
      .optional(),
    free_shipping: z.boolean().optional(),
    usage_limit: z
      .number()
      .min(0, 'Usage limit must be greater than or equal to 0')
      .optional(),
    is_active: z.boolean().optional(),
  }),
});

// Update campaign status schema
export const updateCampaignStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Campaign ID is required'),
  }),
  body: z.object({
    is_active: z.boolean({
      message: 'is_active is required and must be a boolean',
    }),
  }),
});

// Delete campaign schema
export const deleteCampaignSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Campaign ID is required'),
  }),
});

// Export types
export type CreateCampaignBody = z.infer<typeof createCampaignSchema>['body'];
export type GetCampaignsQuery = z.infer<
  typeof getCampaignsQuerySchema
>['query'];
export type GetCampaignByIdParams = z.infer<
  typeof getCampaignByIdSchema
>['params'];
export type GetCampaignByIdQuery = z.infer<
  typeof getCampaignByIdSchema
>['query'];
export type UpdateCampaignBody = z.infer<typeof updateCampaignSchema>['body'];
export type UpdateCampaignParams = z.infer<
  typeof updateCampaignSchema
>['params'];
export type UpdateCampaignStatusBody = z.infer<
  typeof updateCampaignStatusSchema
>['body'];
export type UpdateCampaignStatusParams = z.infer<
  typeof updateCampaignStatusSchema
>['params'];
export type DeleteCampaignParams = z.infer<
  typeof deleteCampaignSchema
>['params'];
