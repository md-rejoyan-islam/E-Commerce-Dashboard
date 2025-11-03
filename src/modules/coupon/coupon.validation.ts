import z from 'zod';
import CouponModel from './coupon.model';

// Valid coupon fields that can be requested
const validCouponFields = Object.keys(CouponModel.schema.paths);

// Discount type enum
const discountTypeEnum = z.enum(['percentage', 'fixed_amount']);

// Create coupon schema
export const createCouponSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Coupon name is required').trim(),
    description: z.string().min(1, 'Coupon description is required'),
    code: z
      .string()
      .min(1, 'Coupon code is required')
      .trim()
      .toUpperCase()
      .regex(
        /^[A-Z0-9]+$/,
        'Coupon code must contain only letters and numbers',
      ),
    discount_type: discountTypeEnum,
    discount_value: z
      .number({
        message: 'Discount value is required',
      })
      .min(0, 'Discount value must be greater than or equal to 0'),
    usage_limit_per_user: z
      .number()
      .min(1, 'Usage limit per user must be at least 1')
      .default(1)
      .optional(),
    total_usage_limit: z
      .number()
      .min(0, 'Total usage limit must be greater than or equal to 0')
      .default(0)
      .optional(),
    expiration_date: z.coerce.date({
      message: 'Expiration date is required',
    }),
    minimum_purchase_amount: z
      .number()
      .min(0, 'Minimum purchase amount must be greater than or equal to 0')
      .default(0)
      .optional(),
    is_active: z.boolean().default(true).optional(),
  }),
});

// Get coupons query schema
export const getCouponsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    is_active: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('is_active must be true or false');
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
            (field: string) => !validCouponFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validCouponFields.join(', ')}`,
        },
      ),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  }),
});

// Get coupon by ID schema
export const getCouponByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Coupon ID is required'),
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
            (field: string) => !validCouponFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validCouponFields.join(', ')}`,
        },
      ),
  }),
});

// Update coupon schema
export const updateCouponSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Coupon ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Coupon name is required').trim().optional(),
    description: z.string().min(1, 'Coupon description is required').optional(),
    code: z
      .string()
      .min(1, 'Coupon code is required')
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9]+$/, 'Coupon code must contain only letters and numbers')
      .optional(),
    discount_type: discountTypeEnum.optional(),
    discount_value: z
      .number({
        message: 'Discount value must be a number',
      })
      .min(0, 'Discount value must be greater than or equal to 0')
      .optional(),
    usage_limit_per_user: z
      .number()
      .min(1, 'Usage limit per user must be at least 1')
      .optional(),
    total_usage_limit: z
      .number()
      .min(0, 'Total usage limit must be greater than or equal to 0')
      .optional(),
    expiration_date: z.coerce
      .date({
        message: 'Invalid expiration date format',
      })
      .optional(),
    minimum_purchase_amount: z
      .number()
      .min(0, 'Minimum purchase amount must be greater than or equal to 0')
      .optional(),
    is_active: z.boolean().optional(),
  }),
});

// Update coupon status schema
export const updateCouponStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Coupon ID is required'),
  }),
  body: z.object({
    is_active: z.boolean({
      message: 'is_active is required and must be a boolean',
    }),
  }),
});

// Delete coupon schema
export const deleteCouponSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Coupon ID is required'),
  }),
});

// Export types
export type CreateCouponBody = z.infer<typeof createCouponSchema>['body'];
export type GetCouponsQuery = z.infer<typeof getCouponsQuerySchema>['query'];
export type GetCouponByIdParams = z.infer<typeof getCouponByIdSchema>['params'];
export type GetCouponByIdQuery = z.infer<typeof getCouponByIdSchema>['query'];
export type UpdateCouponBody = z.infer<typeof updateCouponSchema>['body'];
export type UpdateCouponParams = z.infer<typeof updateCouponSchema>['params'];
export type UpdateCouponStatusBody = z.infer<
  typeof updateCouponStatusSchema
>['body'];
export type UpdateCouponStatusParams = z.infer<
  typeof updateCouponStatusSchema
>['params'];
export type DeleteCouponParams = z.infer<typeof deleteCouponSchema>['params'];
