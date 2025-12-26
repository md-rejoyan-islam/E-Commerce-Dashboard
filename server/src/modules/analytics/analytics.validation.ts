import { z } from 'zod';

// Query schema for analytics
const analyticsQueryObject = z.object({
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().default('daily'),
});

// Full validation schema for middleware
export const analyticsQuerySchema = z.object({
  query: analyticsQueryObject,
});

export type AnalyticsQuery = z.infer<typeof analyticsQueryObject>;

// Sales analytics schema
const salesQueryObject = z.object({
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().default('daily'),
});

export const salesAnalyticsSchema = z.object({
  query: salesQueryObject,
});

export type SalesAnalyticsQuery = z.infer<typeof salesQueryObject>;

// Top products schema
const topProductsQueryObject = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(10),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
});

export const topProductsSchema = z.object({
  query: topProductsQueryObject,
});

export type TopProductsQuery = z.infer<typeof topProductsQueryObject>;
