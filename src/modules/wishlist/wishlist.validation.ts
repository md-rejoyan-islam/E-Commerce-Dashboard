import z from 'zod';
import WishlistModel from './wishlist.model';

// Valid wishlist fields that can be requested
const validWishlistFields = Object.keys(WishlistModel.schema.paths);

// Add item to wishlist schema
export const addItemToWishlistSchema = z.object({
  body: z.object({
    product: z.string().min(1, 'Product ID is required'),
  }),
});

// Get wishlist item by ID schema
export const getWishlistItemSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Item ID is required'),
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
          throw new Error('includeUser must be true or false');
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
            (field: string) => !validWishlistFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validWishlistFields.join(', ')}`,
        },
      ),
  }),
});

// Remove wishlist item schema
export const removeWishlistItemSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Item ID is required'),
  }),
});

// Get wishlist schema
export const getWishlistSchema = z.object({
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
          throw new Error('includeUser must be true or false');
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
            (field: string) => !validWishlistFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validWishlistFields.join(', ')}`,
        },
      ),
  }),
});

// Get all wishlist items schema (admin)
export const getAllWishlistItemsSchema = z.object({
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
          throw new Error('includeUser must be true or false');
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
            (field: string) => !validWishlistFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validWishlistFields.join(', ')}`,
        },
      ),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  }),
});

// Get user wishlist schema (admin)
export const getUserWishlistSchema = z.object({
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
      .optional()
      .transform((val) => val === 'true'),
    includeProduct: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeUser must be true or false');
        },
      })
      .optional()
      .transform((val) => val === 'true'),
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
            (field: string) => !validWishlistFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validWishlistFields.join(', ')}`,
        },
      ),
  }),
});

// Clear user wishlist schema (admin)
export const clearUserWishlistSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});

export type GetWishlistQuery = z.infer<typeof getWishlistSchema>['query'];
export type GetAllWishlistItemsQuery = z.infer<
  typeof getAllWishlistItemsSchema
>['query'];
export type GetUserWishlistQuery = z.infer<typeof getUserWishlistSchema>;
