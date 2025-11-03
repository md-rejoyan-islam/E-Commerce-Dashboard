import { Response } from 'express';
import { IRequestWithUser } from '../../app/types';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { OrderService } from './order.service';
import {
  CancelOrderBody,
  CreateOrderBody,
  GetOrderByIdQuery,
  GetOrdersQuery,
  GetOrderStatsQuery,
  GetUserOrdersQuery,
  RefundOrderBody,
  ReturnOrderBody,
  UpdateOrderBody,
  UpdateOrderStatusBody,
  UpdateTrackingBody,
} from './order.validation';

/**
 * Create a new order
 * @route POST /api/v1/orders
 * @access Authenticated
 * @body {object} Order data
 * @returns {object} Created order ID
 */
export const createOrder = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const body = req.body as CreateOrderBody;
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const order = await OrderService.create(body, userId);

    return successResponse(res, {
      statusCode: 201,
      message: 'Order created successfully',
      payload: { data: order },
    });
  },
);

/**
 * Get all orders with filters and pagination
 * @route GET /api/v1/orders
 * @access Authenticated
 * @query {string} user_id - Filter by user ID
 * @query {string} order_status - Filter by order status
 * @query {string} fields - Comma-separated fields to return
 * @query {string} sortBy - Sort by field (default: createdAt)
 * @query {string} sortOrder - Sort order: asc or desc (default: desc)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @returns {object} List of orders with pagination info
 */
export const listOrders = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const query = req.query as unknown as GetOrdersQuery;
    const result = await OrderService.list(query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Orders fetched successfully',
      payload: { data: result.orders, pagination: result.pagination },
    });
  },
);

/**
 * Get a specific order by ID
 * @route GET /api/v1/orders/:id
 * @access Authenticated
 * @param {string} id - Order ID
 * @query {string} fields - Comma-separated fields to return
 * @returns {object} Order details
 */
export const getOrderById = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const query = req.query as GetOrderByIdQuery;
    const order = await OrderService.getById(id, query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order fetched successfully',
      payload: { data: order },
    });
  },
);

/**
 * Update a specific order
 * @route PUT /api/v1/orders/:id
 * @access Admin only
 * @param {string} id - Order ID
 * @body {object} Order data to update
 * @returns {object} Updated order
 */
export const updateOrder = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as UpdateOrderBody;
    const order = await OrderService.update(id, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order updated successfully',
      payload: { data: order },
    });
  },
);

/**
 * Update order status
 * @route PATCH /api/v1/orders/:id/status
 * @access Admin only
 * @param {string} id - Order ID
 * @body {string} order_status - New order status
 * @returns {object} Updated order
 */
export const updateOrderStatus = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const { order_status } = req.body as UpdateOrderStatusBody;
    const order = await OrderService.updateStatus(id, order_status);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order status updated successfully',
      payload: { data: order },
    });
  },
);

/**
 * Cancel a specific order
 * @route POST /api/v1/orders/:id/cancel
 * @access Authenticated
 * @param {string} id - Order ID
 * @body {string} cancellation_reason - Reason for cancellation
 * @returns {object} Updated order
 */
export const cancelOrder = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as CancelOrderBody;
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const order = await OrderService.cancel(id, body, userId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order cancelled successfully',
      payload: { data: order },
    });
  },
);

/**
 * Return a specific order
 * @route POST /api/v1/orders/:id/return
 * @access Authenticated
 * @param {string} id - Order ID
 * @body {string} return_reason - Reason for return
 * @returns {object} Updated order
 */
export const returnOrder = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as ReturnOrderBody;
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const order = await OrderService.return(id, body, userId);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order returned successfully',
      payload: { data: order },
    });
  },
);

/**
 * Process a refund for a specific order
 * @route POST /api/v1/orders/:id/refund
 * @access Admin only
 * @param {string} id - Order ID
 * @body {number} refund_amount - Refund amount
 * @body {string} refund_status - Refund status
 * @returns {object} Updated order
 */
export const refundOrder = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as RefundOrderBody;
    const order = await OrderService.refund(id, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order refund processed successfully',
      payload: { data: order },
    });
  },
);

/**
 * Get all orders for a specific user
 * @route GET /api/v1/orders/user/:user_id
 * @access Authenticated
 * @param {string} user_id - User ID
 * @query {string} fields - Comma-separated fields to return
 * @query {string} sortBy - Sort by field (default: createdAt)
 * @query {string} sortOrder - Sort order: asc or desc (default: desc)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @returns {object} List of orders with pagination info
 */
export const getUserOrders = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { user_id } = req.params;
    const query = req.query as unknown as GetUserOrdersQuery;
    const result = await OrderService.getUserOrders(user_id, query);

    return successResponse(res, {
      statusCode: 200,
      message: 'User orders fetched successfully',
      payload: { data: result.orders, pagination: result.pagination },
    });
  },
);

/**
 * Get order statistics
 * @route GET /api/v1/orders/stats
 * @access Admin only
 * @query {date} start_date - Start date for statistics
 * @query {date} end_date - End date for statistics
 * @returns {object} Order statistics
 */
export const getOrderStats = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const query = req.query as unknown as GetOrderStatsQuery;
    const stats = await OrderService.getStats(query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order statistics fetched successfully',
      payload: { data: stats },
    });
  },
);

/**
 * Generate order report
 * @route GET /api/v1/orders/report
 * @access Admin only
 * @query {date} start_date - Start date for report
 * @query {date} end_date - End date for report
 * @returns {object} Order report
 */
export const getOrderReport = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const query = req.query as unknown as GetOrderStatsQuery;
    const report = await OrderService.getReport(query);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order report generated successfully',
      payload: { data: report },
    });
  },
);

/**
 * Update tracking information
 * @route POST /api/v1/orders/:id/track
 * @access Admin only
 * @param {string} id - Order ID
 * @body {string} tracking_number - Tracking number
 * @returns {object} Updated order
 */
export const updateTracking = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const body = req.body as UpdateTrackingBody;
    const order = await OrderService.updateTracking(id, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'Tracking information updated successfully',
      payload: { data: order },
    });
  },
);

/**
 * Get order by tracking number
 * @route GET /api/v1/orders/tracking/:tracking_number
 * @access Authenticated
 * @param {string} tracking_number - Tracking number
 * @returns {object} Order details
 */
export const getOrderByTracking = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { tracking_number } = req.params;
    const order = await OrderService.getByTracking(tracking_number);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order fetched successfully',
      payload: { data: order },
    });
  },
);

/**
 * Delete a specific order
 * @route DELETE /api/v1/orders/:id
 * @access Admin only
 * @param {string} id - Order ID
 * @returns {object} Deleted order ID
 */
export const deleteOrder = asyncHandler(
  async (req: IRequestWithUser, res: Response) => {
    const { id } = req.params;
    const order = await OrderService.delete(id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Order deleted successfully',
      payload: { data: order },
    });
  },
);
