import z from 'zod';
import OfferModel from './offer.model';

// Valid offer fields that can be requested
const validOfferFields = Object.keys(OfferModel.schema.paths);

// Discount type enum
const discountTypeEnum = z.enum(['percentage', 'fixed_amount']);

// Create offer schema
export const createOfferSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Offer name is required').trim(),
    description: z.string().min(1, 'Offer description is required'),
    image: z.string().min(1, 'Offer image is required'),
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
    applicable_products: z.array(z.string()).default([]).optional(),
    free_shipping: z.boolean().default(false).optional(),
    is_active: z.boolean().default(true).optional(),
  }),
});

// Get offers query schema
export const getOffersQuerySchema = z.object({
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
            (field: string) => !validOfferFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validOfferFields.join(', ')}`,
        },
      ),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  }),
});

// Get offer by ID schema
export const getOfferByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Offer ID is required'),
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
            (field: string) => !validOfferFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validOfferFields.join(', ')}`,
        },
      ),
  }),
});

// Update offer schema
export const updateOfferSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Offer ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Offer name is required').trim().optional(),
    description: z.string().min(1, 'Offer description is required').optional(),
    image: z.string().min(1, 'Offer image is required').optional(),
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
    applicable_products: z.array(z.string()).optional(),
    free_shipping: z.boolean().optional(),
    is_active: z.boolean().optional(),
  }),
});

// Update offer status schema
export const updateOfferStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Offer ID is required'),
  }),
  body: z.object({
    is_active: z.boolean({
      message: 'is_active is required and must be a boolean',
    }),
  }),
});

// Delete offer schema
export const deleteOfferSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Offer ID is required'),
  }),
});

// Export types
export type CreateOfferBody = z.infer<typeof createOfferSchema>['body'];
export type GetOffersQuery = z.infer<typeof getOffersQuerySchema>['query'];
export type GetOfferByIdParams = z.infer<typeof getOfferByIdSchema>['params'];
export type GetOfferByIdQuery = z.infer<typeof getOfferByIdSchema>['query'];
export type UpdateOfferBody = z.infer<typeof updateOfferSchema>['body'];
export type UpdateOfferParams = z.infer<typeof updateOfferSchema>['params'];
export type UpdateOfferStatusBody = z.infer<
  typeof updateOfferStatusSchema
>['body'];
export type UpdateOfferStatusParams = z.infer<
  typeof updateOfferStatusSchema
>['params'];
export type DeleteOfferParams = z.infer<typeof deleteOfferSchema>['params'];
