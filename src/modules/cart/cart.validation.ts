import z from 'zod';
import CartModel from './cart.model';

// Valid cart fields that can be requested
const validCartFields = Object.keys(CartModel.schema.paths);

// Add item to cart schema
export const addItemToCartSchema = z.object({
  body: z.object({
    product: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

// Update cart item schema
export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().min(1, 'Item ID is required'),
  }),
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

// Remove cart item schema
export const removeCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().min(1, 'Item ID is required'),
  }),
});

// Get cart schema
export const getCartSchema = z.object({
  query: z.object({
    includeUser: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeUser must be true or false');
        },
      })
      .optional(),
    includeProduct: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeProduct must be true or false');
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
            (field: string) => !validCartFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validCartFields.join(', ')}`,
        },
      ),
  }),
});

// Get all carts schema (admin)
export const getAllCartsSchema = z.object({
  query: z.object({
    includeUser: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeUser must be true or false');
        },
      })
      .optional(),
    includeProduct: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeProduct must be true or false');
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
            (field: string) => !validCartFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validCartFields.join(', ')}`,
        },
      ),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  }),
});

// Get user cart by ID schema (admin)
export const getUserCartSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
  query: z.object({
    includeUser: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeUser must be true or false');
        },
      })
      .optional(),
    includeProduct: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeProduct must be true or false');
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
            (field: string) => !validCartFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validCartFields.join(', ')}`,
        },
      ),
  }),
});

// Clear user cart schema (admin)
export const clearUserCartSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});

export type GetCartQuery = z.infer<typeof getCartSchema>['query'];
export type GetAllCartsQuery = z.infer<typeof getAllCartsSchema>['query'];
export type GetUserCartQuery = z.infer<typeof getUserCartSchema>;
