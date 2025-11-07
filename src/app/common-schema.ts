import z from 'zod';

export const paginationSchema = z.object({
  sortBy: z
    .string({
      error: (iss) => {
        if (iss?.code === 'invalid_type') {
          return 'sortBy must be a string';
        }
      },
    })
    .optional(),
  sortOrder: z
    .enum(['asc', 'desc'], {
      error: () => {
        throw new Error('sortOrder must be either asc or desc');
      },
    })
    .default('asc')
    .optional(),
  page: z.coerce
    .number({
      error: (iss) => {
        if (iss?.code === 'invalid_type') {
          return 'Page must be a number';
        }
      },
    })
    .int()
    .positive()
    .default(1)
    .optional(),
  limit: z.coerce
    .number({
      error: (iss) => {
        if (iss?.code === 'invalid_type') {
          return 'Limit must be a number';
        }
      },
    })
    .int()
    .positive()
    .max(100)
    .default(10)
    .optional(),
});
export const fieldsSchema = (validBannerFields: string[]) =>
  z
    .string({
      error: (iss) => {
        if (iss?.code === 'invalid_type') {
          return 'Fields must be a string';
        }
      },
    })
    .optional()
    .refine(
      (fields) => {
        if (!fields) return true;
        const requestedFields = fields.split(',').map((f: string) => f.trim());
        const invalidFields = requestedFields.filter(
          (field: string) => !validBannerFields.includes(field),
        );
        return invalidFields.length === 0;
      },
      {
        message: `Invalid field(s) requested. Valid fields are: ${validBannerFields.join(', ')}`,
      },
    );

export const searchSchema = z
  .string({
    error: (iss) => {
      if (iss?.code === 'invalid_type') {
        return 'Search must be a string';
      }
    },
  })
  .optional();

export const is_activeSchema = z
  .enum(['true', 'false'], {
    error: () => {
      throw new Error('is_active must be true or false');
    },
  })
  .optional();
