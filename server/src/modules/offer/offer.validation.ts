import z from 'zod';
import {
  fieldsSchema,
  is_activeSchema,
  paginationSchema,
  searchSchema,
} from '../../app/common-schema';
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
  query: paginationSchema.extend({
    search: searchSchema,
    is_active: is_activeSchema,
    includeProducts: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeProducts must be true or false');
        },
      })
      .optional(),
    fields: fieldsSchema(validOfferFields),
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
    fields: fieldsSchema(validOfferFields),
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
