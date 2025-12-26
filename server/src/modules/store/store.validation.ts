import z from 'zod';
import {
  fieldsSchema,
  is_activeSchema,
  paginationSchema,
  searchSchema,
} from '../../app/common-schema';
import StoreModel from './store.model';

// Valid store fields that can be requested
const validStoreFields = Object.keys(StoreModel.schema.paths);

// Helper to coerce string 'true'/'false' to boolean
const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === 'boolean') return val;
    return val === 'true';
  });

// Create store schema
export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Store name is required').trim(),
    description: z.string().optional().default(''),
    city: z.string().optional().default(''),
    country: z.string().optional().default(''),
    division: z.string().optional().default(''),
    zip_code: z.string().optional().default(''),
    map_location: z.string().optional().default(''),
    phone: z.string().optional().default(''),
    email: z.string().email('Invalid email address').trim().toLowerCase().optional(),
    working_hours: z.string().optional().default(''),
    is_active: booleanFromString.optional().default(true),
  }),
});

// Get stores query schema
export const getStoresQuerySchema = z.object({
  query: paginationSchema.extend({
    is_active: is_activeSchema,
    search: searchSchema,
    fields: fieldsSchema(validStoreFields),
  }),
});

// Get store by ID schema
export const getStoreByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Store ID is required'),
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
            (field: string) => !validStoreFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validStoreFields.join(', ')}`,
        },
      ),
  }),
});

// Update store schema
export const updateStoreSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Store ID is required'),
  }),
  body: z.object({
    name: z.string().trim().optional(),
    description: z.string().optional(),
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),
    division: z.string().trim().optional(),
    zip_code: z.string().trim().optional(),
    map_location: z.string().optional(),
    phone: z.string().trim().optional(),
    email: z.string().email('Invalid email address').trim().toLowerCase().optional(),
    working_hours: z.string().optional(),
    is_active: booleanFromString.optional(),
  }),
});

// Update store status schema
export const updateStoreStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Store ID is required'),
  }),
  body: z.object({
    is_active: z.boolean({
      message: 'is_active must be a boolean',
    }),
  }),
});

// Delete store schema
export const deleteStoreSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Store ID is required'),
  }),
});

export type CreateStoreBody = z.infer<typeof createStoreSchema>['body'];
export type GetStoresQuery = z.infer<typeof getStoresQuerySchema>['query'];
export type GetStoreByIdParams = z.infer<typeof getStoreByIdSchema>['params'];
export type GetStoreByIdQuery = z.infer<typeof getStoreByIdSchema>['query'];
export type UpdateStoreParams = z.infer<typeof updateStoreSchema>['params'];
export type UpdateStoreBody = z.infer<typeof updateStoreSchema>['body'];
export type UpdateStoreStatusParams = z.infer<
  typeof updateStoreStatusSchema
>['params'];
export type UpdateStoreStatusBody = z.infer<
  typeof updateStoreStatusSchema
>['body'];
export type DeleteStoreParams = z.infer<typeof deleteStoreSchema>['params'];
