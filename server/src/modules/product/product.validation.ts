import z from 'zod';
import {
  fieldsSchema,
  paginationSchema,
  searchSchema,
} from '../../app/common-schema';
import { isValidMongoId } from '../../utils/is-valid-mongo-id';
import ProductModel from './product.model';

// Valid product fields that can be requested
const validProductFields = Object.keys(ProductModel.schema.paths);

// Inventory validation schema
const inventorySchema = z.object({
  quantity_available: z.coerce
    .number({
      error: (iss) => {
        if (iss?.code === 'invalid_type') {
          return 'Quantity available must be a number';
        } else if (!iss?.input) {
          return 'Quantity available is required';
        }
      },
    })
    .min(1, 'Quantity available must be at least 1'),
  quantity_reserved: z
    .number({
      error: (iss) => {
        if (iss?.code === 'invalid_type') {
          return 'Quantity reserved must be a number';
        }
      },
    })
    .int()
    .min(0)
    .optional(),
  quantity_damaged: z
    .number({
      error: (iss) => {
        if (iss?.code === 'invalid_type') {
          return 'Quantity damaged must be a number';
        }
      },
    })
    .int()
    .min(0)
    .optional(),
});

// Variant validation schema
const variantSchema = z.object({
  sku: z
    .string({
      error: (iss) => {
        if (!iss?.input) {
          return 'SKU is required';
        } else if (iss?.code === 'invalid_type') {
          return 'SKU must be a string';
        }
      },
    })
    .min(1, 'SKU is required'),
  attributes: z
    .record(z.string(), z.string())
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one attribute must be provided',
    }),
  price: z
    .number({
      error: (iss) => {
        if (!iss?.input) {
          return 'Price is required';
        } else if (iss?.code === 'invalid_type') {
          return 'Price must be a number';
        }
      },
    })
    .positive('Price must be positive'),
  sale_price: z
    .number({
      error: (iss) => {
        if (!iss?.input) {
          return 'Sale price must be a number';
        } else if (iss?.code === 'invalid_type') {
          return 'Sale price must be a number';
        }
      },
    })
    .positive(),
  inventory: z
    .any()
    .refine((val) => val !== undefined, { message: 'Inventory is required' })
    .refine((val) => typeof val === 'object' && val !== null, {
      message: 'Inventory must be a valid object',
    })
    .transform((val) => inventorySchema.parse(val)),
});

// Helper to parse JSON string or return array as-is
const variantsTransform = z
  .string({
    error: (iss) => {
      console.log(iss);

      if (!iss?.input) {
        return 'Variants data is required';
      } else if (iss?.code === 'invalid_type') {
        return 'Variants must be a JSON string';
      }
    },
  })
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch {
      ctx.addIssue({
        code: 'invalid_format',
        format: 'json',
        message: 'Variants must be a valid JSON string',
      });
      return z.NEVER;
    }
  })
  .transform((val) => z.array(variantSchema).parse(val));

// Helper to convert string boolean to actual boolean
const booleanTransform = z.union([
  z.boolean(),
  z.string().transform((val) => val === 'true'),
]);

// Review validation schema
const reviewSchema = z.object({
  rating: z
    .number({
      error: (iss) => {
        if (!iss?.input) {
          return 'Rating is required';
        } else if (iss?.code === 'invalid_type') {
          return 'Rating must be a number';
        }
      },
    })
    .min(1)
    .max(5, 'Rating must be between 1 and 5'),
  comment: z
    .string({
      error: (iss) => {
        if (!iss?.input) {
          return 'Comment is required';
        } else if (iss?.code === 'invalid_type') {
          return 'Comment must be a string';
        }
      },
    })
    .min(1, 'Comment is required'),
});

// FAQ validation schema
const faqSchema = z.object({
  question: z
    .string({
      error: (iss) => {
        if (!iss?.input) {
          return 'Question is required';
        } else if (iss?.code === 'invalid_type') {
          return 'Question must be a string';
        }
      },
    })
    .min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required').optional(),
});

// Create product schema - handles both JSON and FormData
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Product name is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Product name must be a string';
          }
        },
      })
      .min(1, 'Product name is required'),
    description: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Description is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Description must be a string';
          }
        },
      })
      .min(10, 'Description must be at least 10 characters long'),
    category: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Category is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Category must be a string';
          }
        },
      })
      .min(1, 'Category is required')
      .refine((val) => isValidMongoId(val), {
        message: 'Category must be a valid Mongo ID',
      }),
    brand: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Brand is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Brand must be a string';
          }
        },
      })
      .min(1, 'Brand is required')
      .refine((val) => isValidMongoId(val), {
        message: 'Brand must be a valid Mongo ID',
      }),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly')
      .optional(),
    featured: booleanTransform.optional(),
    is_active: booleanTransform.optional(),
    variants: variantsTransform.refine(
      (data) => Array.isArray(data) && data.length > 0,
      { message: 'At least one variant is required' },
    ),
  }),
});

// Update product schema
export const updateProductSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      brand: z.string().optional(),
      slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly')
        .optional(),
      featured: z.boolean().optional(),
      is_active: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

// Change status schema
export const changeStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ is_active: z.boolean() }),
});

// Add variant schema
export const addVariantSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: variantSchema,
});

// Update variant schema
export const updateVariantSchema = z.object({
  params: z.object({
    id: z.string().min(1),
    variantId: z.string().min(1),
  }),
  body: z
    .object({
      sku: z.string().min(1).optional(),
      attributes: z.record(z.string(), z.string()).optional(),
      price: z.number().positive().optional(),
      sale_price: z.number().positive().optional(),
      images: z.array(z.string().url()).optional(),
      inventory: inventorySchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

// Add review schema
export const addReviewSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: reviewSchema,
});

// Update review schema
export const updateReviewSchema = z.object({
  params: z.object({
    id: z.string().min(1),
    reviewId: z.string().min(1),
  }),
  body: z
    .object({
      rating: z.number().int().min(1).max(5).optional(),
      comment: z.string().min(1).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

// Add FAQ schema
export const addFAQSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: faqSchema,
});

// Update FAQ schema
export const updateFAQSchema = z.object({
  params: z.object({
    id: z.string().min(1),
    faqId: z.string().min(1),
  }),
  body: z
    .object({
      question: z.string().min(1).optional(),
      answer: z.string().min(1).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

// Update inventory schema
export const updateInventorySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    variantId: z.string().min(1, 'Variant ID is required'),
    inventory: inventorySchema.required(),
  }),
});

// Get products query schema
export const getProductsQuerySchema = z.object({
  query: paginationSchema.extend({
    search: searchSchema,
    category: z.string().optional(),
    brand: z.string().optional(),
    fields: fieldsSchema(validProductFields),
    featured: z
      .string()
      .transform((val) =>
        val === 'true' ? true : val === 'false' ? false : undefined,
      )
      .optional(),
    is_active: z.enum(['true', 'false']).optional(),
    includeCampaigns: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeCampaigns must be true or false');
        },
      })
      .optional(),
    includeOffers: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeOffers must be true or false');
        },
      })
      .optional(),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  query: z.object({
    includeCampaigns: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeCampaigns must be true or false');
        },
      })
      .optional(),
    includeOffers: z
      .enum(['true', 'false'], {
        error: () => {
          throw new Error('includeOffers must be true or false');
        },
      })
      .optional(),
    fields: fieldsSchema(validProductFields),
  }),
});

// Link campaigns schema
export const linkCampaignsSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    campaigns: z
      .array(z.string().min(1))
      .min(1, 'At least one campaign ID is required'),
  }),
});

// Unlink campaign schema
export const unlinkCampaignSchema = z.object({
  params: z.object({
    id: z.string().min(1),
    campaignId: z.string().min(1),
  }),
});

// Link offers schema
export const linkOffersSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    offers: z
      .array(z.string().min(1))
      .min(1, 'At least one offer ID is required'),
  }),
});

// Unlink offer schema
export const unlinkOfferSchema = z.object({
  params: z.object({
    id: z.string().min(1),
    offerId: z.string().min(1),
  }),
});

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>['query'];
export type GetProductByIdQuery = z.infer<typeof getProductByIdSchema>['query'];
