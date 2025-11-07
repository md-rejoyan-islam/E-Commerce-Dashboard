import z from 'zod';
import { fieldsSchema, paginationSchema } from '../../app/common-schema';
import OrderModel from './order.model';

// Valid order fields that can be requested
const validOrderFields = Object.keys(OrderModel.schema.paths);

// Payment method enum
const paymentMethodEnum = z.enum([
  'bkash',
  'rocket',
  'nagad',
  'credit_card',
  'debit_card',
  'cash_on_delivery',
]);

// Order status enum
const orderStatusEnum = z.enum([
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
]);

// Refund status enum
const refundStatusEnum = z.enum(['pending', 'processed', 'failed']);

// Shipping address schema
const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
});

// Order item schema
const orderItemSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
});

// Create order schema
export const createOrderSchema = z.object({
  body: z.object({
    coupon: z.string().optional(),
    order_items: z
      .array(orderItemSchema)
      .min(1, 'At least one order item is required'),
    total_amount: z
      .number({
        message: 'Total amount is required',
      })
      .min(0, 'Total amount must be greater than or equal to 0'),
    payment_method: paymentMethodEnum,
    transaction_id: z.string().min(1, 'Transaction ID is required'),
    shipping_address: shippingAddressSchema,
  }),
});

// Get orders query schema
export const getOrdersQuerySchema = z.object({
  query: paginationSchema.extend({
    user_id: z.string().optional(),
    order_status: orderStatusEnum.optional(),
    fields: fieldsSchema(validOrderFields),
  }),
});

// Get order by ID schema
export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
  query: z.object({
    fields: fieldsSchema(validOrderFields),
  }),
});

// Update order schema
export const updateOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
  body: z.object({
    order_status: orderStatusEnum.optional(),
    shipped_date: z.coerce.date().optional(),
    delivered_date: z.coerce.date().optional(),
    tracking_number: z.string().optional(),
    shipping_address: shippingAddressSchema.partial().optional(),
  }),
});

// Update order status schema
export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
  body: z.object({
    order_status: orderStatusEnum,
  }),
});

// Cancel order schema
export const cancelOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
  body: z.object({
    cancellation_reason: z.string().min(1, 'Cancellation reason is required'),
  }),
});

// Return order schema
export const returnOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
  body: z.object({
    return_reason: z.string().min(1, 'Return reason is required'),
  }),
});

// Refund order schema
export const refundOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
  body: z.object({
    refund_amount: z
      .number()
      .min(0, 'Refund amount must be greater than or equal to 0'),
    refund_status: refundStatusEnum,
  }),
});

// Get user orders schema
export const getUserOrdersSchema = z.object({
  params: z.object({
    user_id: z.string().min(1, 'User ID is required'),
  }),
  query: paginationSchema.extend({
    fields: fieldsSchema(validOrderFields),
  }),
});

// Get order stats schema
export const getOrderStatsSchema = z.object({
  query: z.object({
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
  }),
});

// Update tracking schema
export const updateTrackingSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
  body: z.object({
    tracking_number: z.string().min(1, 'Tracking number is required'),
  }),
});

// Get order by tracking number schema
export const getOrderByTrackingSchema = z.object({
  params: z.object({
    tracking_number: z.string().min(1, 'Tracking number is required'),
  }),
});

// Delete order schema
export const deleteOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
});

// Export types
export type CreateOrderBody = z.infer<typeof createOrderSchema>['body'];
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>['query'];
export type GetOrderByIdParams = z.infer<typeof getOrderByIdSchema>['params'];
export type GetOrderByIdQuery = z.infer<typeof getOrderByIdSchema>['query'];
export type UpdateOrderBody = z.infer<typeof updateOrderSchema>['body'];
export type UpdateOrderParams = z.infer<typeof updateOrderSchema>['params'];
export type UpdateOrderStatusBody = z.infer<
  typeof updateOrderStatusSchema
>['body'];
export type UpdateOrderStatusParams = z.infer<
  typeof updateOrderStatusSchema
>['params'];
export type CancelOrderBody = z.infer<typeof cancelOrderSchema>['body'];
export type CancelOrderParams = z.infer<typeof cancelOrderSchema>['params'];
export type ReturnOrderBody = z.infer<typeof returnOrderSchema>['body'];
export type ReturnOrderParams = z.infer<typeof returnOrderSchema>['params'];
export type RefundOrderBody = z.infer<typeof refundOrderSchema>['body'];
export type RefundOrderParams = z.infer<typeof refundOrderSchema>['params'];
export type GetUserOrdersParams = z.infer<typeof getUserOrdersSchema>['params'];
export type GetUserOrdersQuery = z.infer<typeof getUserOrdersSchema>['query'];
export type GetOrderStatsQuery = z.infer<typeof getOrderStatsSchema>['query'];
export type UpdateTrackingBody = z.infer<typeof updateTrackingSchema>['body'];
export type UpdateTrackingParams = z.infer<
  typeof updateTrackingSchema
>['params'];
export type GetOrderByTrackingParams = z.infer<
  typeof getOrderByTrackingSchema
>['params'];
export type DeleteOrderParams = z.infer<typeof deleteOrderSchema>['params'];
