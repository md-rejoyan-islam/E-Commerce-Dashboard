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

// Create store schema
export const createStoreSchema = z.object({
  body: z.object({
    image: z.string().min(1, 'Store image is required'),
    name: z.string().min(1, 'Store name is required').trim(),
    description: z.string().min(1, 'Store description is required'),
    city: z.string().min(1, 'City is required').trim(),
    country: z.string().min(1, 'Country is required').trim(),
    division: z.string().min(1, 'Division is required').trim(),
    zip_code: z.string().min(1, 'Zip code is required').trim(),
    map_location: z.string().min(1, 'Map location is required'),
    phone: z.string().min(1, 'Phone number is required').trim(),
    email: z.email('Invalid email address').trim().toLowerCase(),
    working_hours: z.string().min(1, 'Working hours is required'),
    is_active: z.boolean().optional().default(true),
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
    image: z.string().min(1, 'Store image is required').optional(),
    name: z.string().min(1, 'Store name is required').trim().optional(),
    description: z.string().min(1, 'Store description is required').optional(),
    city: z.string().min(1, 'City is required').trim().optional(),
    country: z.string().min(1, 'Country is required').trim().optional(),
    division: z.string().min(1, 'Division is required').trim().optional(),
    zip_code: z.string().min(1, 'Zip code is required').trim().optional(),
    map_location: z.string().min(1, 'Map location is required').optional(),
    phone: z.string().min(1, 'Phone number is required').trim().optional(),
    email: z.email('Invalid email address').trim().toLowerCase().optional(),
    working_hours: z.string().min(1, 'Working hours is required').optional(),
    is_active: z.boolean().optional(),
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
