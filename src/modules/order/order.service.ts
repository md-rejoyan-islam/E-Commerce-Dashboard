import createError from 'http-errors';
import {
  deleteCache,
  generateCacheKey,
  getCache,
  setCache,
} from '../../utils/cache';
import { isValidMongoId } from '../../utils/is-valid-mongo-id';
import OrderModel from './order.model';
import { IOrder } from './order.types';
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
  UpdateTrackingBody,
} from './order.validation';

const ORDER_RESOURCE = 'orders';
const CACHE_TTL = 7 * 24 * 60 * 60; // 7 days

export class OrderService {
  static async list(query: GetOrdersQuery) {
    const {
      user_id,
      order_status,
      fields,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${ORDER_RESOURCE}:list`,
      query: {
        user_id,
        order_status,
        fields,
        sortBy,
        sortOrder,
        page,
        limit,
      },
    });

    // Check cache
    const cached = await getCache<{
      orders: IOrder[];
      pagination: {
        items: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    // Build filter
    const filter: {
      user_id?: string;
      order_status?: string;
    } = {};

    if (user_id) {
      filter.user_id = user_id;
    }

    if (order_status) {
      filter.order_status = order_status;
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {
      [sortBy!]: sortOrder === 'asc' ? 1 : -1,
    };

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const orderQuery = OrderModel.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort(sort);

    if (selectFields) {
      orderQuery.select(selectFields);
    }

    // Execute query
    const [orders, total] = await Promise.all([
      orderQuery.lean(),
      OrderModel.countDocuments(filter),
    ]);

    const result = {
      orders,
      pagination: {
        items: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };

    // Cache result
    await setCache(cacheKey, result, CACHE_TTL);

    return result;
  }

  static async getById(id: string, query?: GetOrderByIdQuery) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid order ID');
    }

    const { fields } = query || {};

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${ORDER_RESOURCE}:${id}`,
      query: { fields },
    });

    // Check cache
    const cached = await getCache<IOrder>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    // Build query
    const orderQuery = OrderModel.findById(id);

    if (selectFields) {
      orderQuery.select(selectFields);
    }

    // Execute query
    const order = await orderQuery.lean();

    if (!order) {
      throw createError.NotFound('Order not found');
    }

    // Cache result
    await setCache(cacheKey, order, CACHE_TTL);

    return order;
  }

  static async create(data: CreateOrderBody, userId: string) {
    // Check if transaction ID already exists
    const existingOrder = await OrderModel.findOne({
      transaction_id: data.transaction_id,
    });
    if (existingOrder) {
      throw createError.Conflict('Transaction ID already exists');
    }

    const orderData = {
      ...data,
      user_id: userId,
      order_status: 'pending' as const,
      is_returned: false,
      is_active: true,
    };

    const order = await OrderModel.create(orderData);

    // Invalidate cache
    await deleteCache(generateCacheKey({ resource: ORDER_RESOURCE }));

    return { _id: order._id, id: order.id };
  }

  static async update(id: string, data: UpdateOrderBody) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid order ID');
    }

    const order = await OrderModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();

    if (!order) {
      throw createError.NotFound('Order not found');
    }

    // Invalidate cache
    await deleteCache(
      generateCacheKey({ resource: `${ORDER_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: ORDER_RESOURCE }));

    return order;
  }

  static async updateStatus(id: string, order_status: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid order ID');
    }

    const updateData: Record<string, unknown> = { order_status };

    // Update relevant dates based on status
    if (order_status === 'shipped') {
      updateData.shipped_date = new Date();
    } else if (order_status === 'delivered') {
      updateData.delivered_date = new Date();
    }

    const order = await OrderModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    if (!order) {
      throw createError.NotFound('Order not found');
    }

    // Invalidate cache
    await deleteCache(
      generateCacheKey({ resource: `${ORDER_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: ORDER_RESOURCE }));

    return order;
  }

  static async cancel(id: string, data: CancelOrderBody, userId: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid order ID');
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      throw createError.NotFound('Order not found');
    }

    // Check if user owns the order or is admin
    if (order.user_id !== userId) {
      throw createError.Forbidden(
        'You are not authorized to cancel this order',
      );
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'returned'].includes(order.order_status)) {
      throw createError.BadRequest(
        `Order cannot be cancelled as it is already ${order.order_status}`,
      );
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      {
        order_status: 'cancelled',
        cancellation_date: new Date(),
        cancellation_reason: data.cancellation_reason,
      },
      { new: true },
    ).lean();

    // Invalidate cache
    await deleteCache(
      generateCacheKey({ resource: `${ORDER_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: ORDER_RESOURCE }));

    return updatedOrder;
  }

  static async return(id: string, data: ReturnOrderBody, userId: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid order ID');
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      throw createError.NotFound('Order not found');
    }

    // Check if user owns the order
    if (order.user_id !== userId) {
      throw createError.Forbidden(
        'You are not authorized to return this order',
      );
    }

    // Check if order can be returned
    if (order.order_status !== 'delivered') {
      throw createError.BadRequest('Only delivered orders can be returned');
    }

    if (order.is_returned) {
      throw createError.BadRequest('Order has already been returned');
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      {
        order_status: 'returned',
        is_returned: true,
        return_date: new Date(),
        return_reason: data.return_reason,
      },
      { new: true },
    ).lean();

    // Invalidate cache
    await deleteCache(
      generateCacheKey({ resource: `${ORDER_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: ORDER_RESOURCE }));

    return updatedOrder;
  }

  static async refund(id: string, data: RefundOrderBody) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid order ID');
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      throw createError.NotFound('Order not found');
    }

    // Check if order is cancelled or returned
    if (!['cancelled', 'returned'].includes(order.order_status)) {
      throw createError.BadRequest(
        'Only cancelled or returned orders can be refunded',
      );
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      {
        refund_amount: data.refund_amount,
        refund_status: data.refund_status,
      },
      { new: true },
    ).lean();

    // Invalidate cache
    await deleteCache(
      generateCacheKey({ resource: `${ORDER_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: ORDER_RESOURCE }));

    return updatedOrder;
  }

  static async getUserOrders(userId: string, query: GetUserOrdersQuery) {
    if (!isValidMongoId(userId)) {
      throw createError.BadRequest('Invalid user ID');
    }

    const {
      fields,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${ORDER_RESOURCE}:user:${userId}`,
      query: { fields, sortBy, sortOrder, page, limit },
    });

    // Check cache
    const cached = await getCache<{
      orders: IOrder[];
      pagination: {
        items: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {
      [sortBy!]: sortOrder === 'asc' ? 1 : -1,
    };

    // Build select fields
    let selectFields = '';
    if (fields) {
      selectFields = fields
        .split(',')
        .map((f) => f.trim())
        .join(' ');
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const orderQuery = OrderModel.find({ user_id: userId })
      .skip(skip)
      .limit(Number(limit))
      .sort(sort);

    if (selectFields) {
      orderQuery.select(selectFields);
    }

    // Execute query
    const [orders, total] = await Promise.all([
      orderQuery.lean(),
      OrderModel.countDocuments({ user_id: userId }),
    ]);

    const result = {
      orders,
      pagination: {
        items: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };

    // Cache result
    await setCache(cacheKey, result, CACHE_TTL);

    return result;
  }

  static async getStats(query: GetOrderStatsQuery) {
    const { start_date, end_date } = query;

    const filter: { createdAt?: Record<string, Date> } = {};

    if (start_date || end_date) {
      filter.createdAt = {};
      if (start_date) {
        filter.createdAt.$gte = start_date;
      }
      if (end_date) {
        filter.createdAt.$lte = end_date;
      }
    }

    const stats = await OrderModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total_amount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$order_status', 'pending'] }, 1, 0] },
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$order_status', 'processing'] }, 1, 0] },
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$order_status', 'shipped'] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$order_status', 'delivered'] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$order_status', 'cancelled'] }, 1, 0] },
          },
          returnedOrders: {
            $sum: { $cond: [{ $eq: ['$order_status', 'returned'] }, 1, 0] },
          },
        },
      },
    ]);

    return stats[0] || {};
  }

  static async getReport(query: GetOrderStatsQuery) {
    return this.getStats(query);
  }

  static async updateTracking(id: string, data: UpdateTrackingBody) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid order ID');
    }

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { tracking_number: data.tracking_number },
      { new: true },
    ).lean();

    if (!order) {
      throw createError.NotFound('Order not found');
    }

    // Invalidate cache
    await deleteCache(
      generateCacheKey({ resource: `${ORDER_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: ORDER_RESOURCE }));

    return order;
  }

  static async getByTracking(tracking_number: string) {
    // Generate cache key
    const cacheKey = generateCacheKey({
      resource: `${ORDER_RESOURCE}:tracking:${tracking_number}`,
    });

    // Check cache
    const cached = await getCache<IOrder>(cacheKey);
    if (cached) {
      return cached;
    }

    const order = await OrderModel.findOne({ tracking_number }).lean();

    if (!order) {
      throw createError.NotFound('Order not found with this tracking number');
    }

    // Cache result
    await setCache(cacheKey, order, CACHE_TTL);

    return order;
  }

  static async delete(id: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest('Invalid order ID');
    }

    const order = await OrderModel.findByIdAndDelete(id).select('_id').lean();

    if (!order) {
      throw createError.NotFound('Order not found');
    }

    // Invalidate cache
    await deleteCache(
      generateCacheKey({ resource: `${ORDER_RESOURCE}:${id}` }),
    );
    await deleteCache(generateCacheKey({ resource: ORDER_RESOURCE }));

    return { _id: order._id };
  }
}
