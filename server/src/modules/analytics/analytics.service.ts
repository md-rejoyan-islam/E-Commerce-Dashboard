import mongoose from 'mongoose';
import BannerModel from '../banner/banner.model';
import BrandModel from '../brand/brand.model';
import CampaignModel from '../campaign/campaign.model';
import CategoryModel from '../category/category.model';
import CouponModel from '../coupon/coupon.model';
import OrderModel from '../order/order.model';
import ProductModel from '../product/product.model';
import StoreModel from '../store/store.model';
import UserModel from '../user/user.model';
import { AnalyticsQuery, TopProductsQuery } from './analytics.validation';

export class AnalyticsService {
  // Get dashboard summary with all module stats
  static async getDashboardSummary() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Execute all queries in parallel for better performance
    const [
      productStats,
      brandStats,
      categoryStats,
      orderStats,
      userStats,
      revenueStats,
      campaignStats,
      couponStats,
      storeStats,
      bannerStats,
    ] = await Promise.all([
      // Product stats
      Promise.all([
        ProductModel.countDocuments(),
        ProductModel.countDocuments({ is_active: true }),
        ProductModel.countDocuments({ is_active: false }),
        ProductModel.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      ]),

      // Brand stats
      Promise.all([
        BrandModel.countDocuments(),
        BrandModel.countDocuments({ is_active: true }),
        BrandModel.countDocuments({ is_active: false }),
      ]),

      // Category stats
      Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.countDocuments({ is_active: true }),
        CategoryModel.countDocuments({ is_active: false }),
      ]),

      // Order stats
      Promise.all([
        OrderModel.countDocuments(),
        OrderModel.countDocuments({ order_status: 'pending' }),
        OrderModel.countDocuments({ order_status: 'processing' }),
        OrderModel.countDocuments({ order_status: 'shipped' }),
        OrderModel.countDocuments({ order_status: 'delivered' }),
        OrderModel.countDocuments({ order_status: 'cancelled' }),
        OrderModel.countDocuments({ order_status: 'returned' }),
        OrderModel.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      ]),

      // User stats
      Promise.all([
        UserModel.countDocuments(),
        UserModel.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
        UserModel.countDocuments({ is_verified: true }),
      ]),

      // Revenue stats
      OrderModel.aggregate([
        {
          $facet: {
            total: [
              { $match: { order_status: { $nin: ['cancelled', 'returned'] } } },
              { $group: { _id: null, total: { $sum: '$total_amount' }, count: { $sum: 1 } } },
            ],
            thisMonth: [
              {
                $match: {
                  order_status: { $nin: ['cancelled', 'returned'] },
                  createdAt: { $gte: monthStart, $lte: monthEnd },
                },
              },
              { $group: { _id: null, total: { $sum: '$total_amount' } } },
            ],
          },
        },
      ]),

      // Campaign stats
      Promise.all([
        CampaignModel.countDocuments(),
        CampaignModel.countDocuments({ is_active: true }),
      ]),

      // Coupon stats
      Promise.all([
        CouponModel.countDocuments(),
        CouponModel.countDocuments({ is_active: true }),
      ]),

      // Store stats
      Promise.all([
        StoreModel.countDocuments(),
        StoreModel.countDocuments({ is_active: true }),
      ]),

      // Banner stats
      Promise.all([
        BannerModel.countDocuments(),
        BannerModel.countDocuments({ is_active: true }),
      ]),
    ]);

    const totalRevenue = revenueStats[0]?.total?.[0]?.total || 0;
    const totalOrders = revenueStats[0]?.total?.[0]?.count || 0;
    const thisMonthRevenue = revenueStats[0]?.thisMonth?.[0]?.total || 0;

    return {
      products: {
        total: productStats[0],
        active: productStats[1],
        inactive: productStats[2],
        new_this_month: productStats[3],
      },
      brands: {
        total: brandStats[0],
        active: brandStats[1],
        inactive: brandStats[2],
      },
      categories: {
        total: categoryStats[0],
        active: categoryStats[1],
        inactive: categoryStats[2],
      },
      orders: {
        total: orderStats[0],
        pending: orderStats[1],
        processing: orderStats[2],
        shipped: orderStats[3],
        delivered: orderStats[4],
        cancelled: orderStats[5],
        returned: orderStats[6],
        this_month: orderStats[7],
      },
      users: {
        total: userStats[0],
        new_this_month: userStats[1],
        verified: userStats[2],
      },
      revenue: {
        total: totalRevenue,
        this_month: thisMonthRevenue,
        average_order_value: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
      },
      campaigns: {
        total: campaignStats[0],
        active: campaignStats[1],
      },
      coupons: {
        total: couponStats[0],
        active: couponStats[1],
      },
      stores: {
        total: storeStats[0],
        active: storeStats[1],
      },
      banners: {
        total: bannerStats[0],
        active: bannerStats[1],
      },
    };
  }

  // Get sales analytics with time series data
  static async getSalesAnalytics(query: AnalyticsQuery) {
    const { start_date, end_date, period = 'daily' } = query;

    // Ensure dates are Date objects (query params may come as strings)
    const endDate = end_date ? new Date(end_date) : new Date();

    // Calculate default start date based on period if not provided
    // Use very early date to include all historical data when no start_date provided
    let startDate: Date;
    if (start_date) {
      startDate = new Date(start_date);
    } else {
      // Default: include all orders from the beginning of time
      startDate = new Date(2020, 0, 1); // Jan 1, 2020 - should cover all orders
    }

    // Determine the date format based on period
    let dateFormat: string;
    switch (period) {
      case 'yearly':
        dateFormat = '%Y';
        break;
      case 'monthly':
        dateFormat = '%Y-%m';
        break;
      case 'weekly':
        dateFormat = '%Y-W%V';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const salesData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $exists: true, $gte: startDate, $lte: endDate },
          order_status: { $nin: ['cancelled', 'returned'] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          sales: { $sum: '$total_amount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          sales: 1,
          orders: 1,
        },
      },
    ]);

    // Calculate totals
    const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
    const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);

    return {
      period,
      start_date: startDate,
      end_date: endDate,
      total_sales: totalSales,
      total_orders: totalOrders,
      average_order_value: totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0,
      data: salesData,
    };
  }

  // Get order analytics with status breakdown
  static async getOrderAnalytics(query: AnalyticsQuery) {
    const { start_date, end_date, period = 'daily' } = query;

    // Ensure dates are Date objects (query params may come as strings)
    const endDate = end_date ? new Date(end_date) : new Date();

    // Calculate default start date based on period if not provided
    // Use very early date to include all historical data when no start_date provided
    let startDate: Date;
    if (start_date) {
      startDate = new Date(start_date);
    } else {
      // Default: include all orders from the beginning of time
      startDate = new Date(2020, 0, 1); // Jan 1, 2020 - should cover all orders
    }

    let dateFormat: string;
    switch (period) {
      case 'yearly':
        dateFormat = '%Y';
        break;
      case 'monthly':
        dateFormat = '%Y-%m';
        break;
      case 'weekly':
        dateFormat = '%Y-W%V';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const orderData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          orders: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$order_status', 'pending'] }, 1, 0] } },
          processing: { $sum: { $cond: [{ $eq: ['$order_status', 'processing'] }, 1, 0] } },
          shipped: { $sum: { $cond: [{ $eq: ['$order_status', 'shipped'] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ['$order_status', 'delivered'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$order_status', 'cancelled'] }, 1, 0] } },
          returned: { $sum: { $cond: [{ $eq: ['$order_status', 'returned'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate totals
    const totals = orderData.reduce(
      (acc, item) => ({
        total: acc.total + item.orders,
        pending: acc.pending + item.pending,
        processing: acc.processing + item.processing,
        shipped: acc.shipped + item.shipped,
        delivered: acc.delivered + item.delivered,
        cancelled: acc.cancelled + item.cancelled,
        returned: acc.returned + item.returned,
      }),
      { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, returned: 0 }
    );

    return {
      period,
      start_date: startDate,
      end_date: endDate,
      total_orders: totals.total,
      by_status: {
        pending: totals.pending,
        processing: totals.processing,
        shipped: totals.shipped,
        delivered: totals.delivered,
        cancelled: totals.cancelled,
        returned: totals.returned,
      },
      data: orderData.map((item) => ({
        date: item._id,
        orders: item.orders,
        status_breakdown: {
          pending: item.pending,
          processing: item.processing,
          shipped: item.shipped,
          delivered: item.delivered,
          cancelled: item.cancelled,
          returned: item.returned,
        },
      })),
    };
  }

  // Get top selling products
  static async getTopProducts(query: TopProductsQuery) {
    const { limit: limitParam = 10, start_date, end_date } = query;
    // Ensure limit is a number (query params come as strings)
    const limit = Number(limitParam) || 10;

    // Ensure dates are Date objects (query params may come as strings)
    const endDate = end_date ? new Date(end_date) : new Date();
    // Default: include all orders from the beginning of time
    const startDate = start_date ? new Date(start_date) : new Date(2020, 0, 1);

    const topProducts = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          order_status: { $nin: ['cancelled', 'returned'] },
        },
      },
      { $unwind: '$order_items' },
      {
        // Convert string product_id to ObjectId for lookup (handle invalid ObjectIds gracefully)
        $addFields: {
          'order_items.product_object_id': {
            $cond: {
              if: { $regexMatch: { input: '$order_items.product_id', regex: /^[0-9a-fA-F]{24}$/ } },
              then: { $toObjectId: '$order_items.product_id' },
              else: null,
            },
          },
        },
      },
      {
        // Filter out items with invalid product IDs
        $match: {
          'order_items.product_object_id': { $ne: null },
        },
      },
      {
        $group: {
          _id: '$order_items.product_object_id',
          total_sold: { $sum: '$order_items.quantity' },
          revenue: { $sum: { $multiply: ['$order_items.price', '$order_items.quantity'] } },
        },
      },
      { $sort: { total_sold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          product_id: '$_id',
          name: '$product.name',
          total_sold: 1,
          revenue: 1,
        },
      },
    ]);

    return topProducts;
  }

  // Get low stock products
  static async getLowStockProducts(threshold: number = 10) {
    const lowStockProducts = await ProductModel.aggregate([
      { $unwind: '$variants' },
      {
        $match: {
          'variants.inventory.quantity_available': { $lte: threshold },
          is_active: true,
        },
      },
      {
        $project: {
          _id: 0,
          product_id: '$_id',
          name: 1,
          sku: '$variants.sku',
          quantity: '$variants.inventory.quantity_available',
        },
      },
      { $sort: { quantity: 1 } },
      { $limit: 20 },
    ]);

    return lowStockProducts;
  }

  // Get sales by category
  static async getSalesByCategory(query: AnalyticsQuery) {
    const { start_date, end_date } = query;

    // Ensure dates are Date objects (query params may come as strings)
    const endDate = end_date ? new Date(end_date) : new Date();
    // Default: include all orders from the beginning of time
    const startDate = start_date ? new Date(start_date) : new Date(2020, 0, 1);

    const categoryStats = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          order_status: { $nin: ['cancelled', 'returned'] },
        },
      },
      { $unwind: '$order_items' },
      {
        // Convert string product_id to ObjectId for lookup (handle invalid ObjectIds gracefully)
        $addFields: {
          'order_items.product_object_id': {
            $cond: {
              if: { $regexMatch: { input: '$order_items.product_id', regex: /^[0-9a-fA-F]{24}$/ } },
              then: { $toObjectId: '$order_items.product_id' },
              else: null,
            },
          },
        },
      },
      {
        // Filter out items with invalid product IDs
        $match: {
          'order_items.product_object_id': { $ne: null },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'order_items.product_object_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: '$order_items.quantity' },
          total_sales: { $sum: { $multiply: ['$order_items.price', '$order_items.quantity'] } },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          category_id: '$_id',
          category_name: '$category.name',
          count: 1,
          total_sales: 1,
        },
      },
      { $sort: { total_sales: -1 } },
    ]);

    return categoryStats;
  }

  // Get revenue comparison (current vs previous period)
  static async getRevenueComparison() {
    const now = new Date();

    // Current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Previous month
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Current week
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    // Previous week
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const previousWeekEnd = new Date(currentWeekStart);
    previousWeekEnd.setMilliseconds(-1);

    const [currentMonth, previousMonth, currentWeek, previousWeek] = await Promise.all([
      OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd },
            order_status: { $nin: ['cancelled', 'returned'] },
          },
        },
        { $group: { _id: null, total: { $sum: '$total_amount' }, orders: { $sum: 1 } } },
      ]),
      OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd },
            order_status: { $nin: ['cancelled', 'returned'] },
          },
        },
        { $group: { _id: null, total: { $sum: '$total_amount' }, orders: { $sum: 1 } } },
      ]),
      OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: currentWeekStart, $lte: now },
            order_status: { $nin: ['cancelled', 'returned'] },
          },
        },
        { $group: { _id: null, total: { $sum: '$total_amount' }, orders: { $sum: 1 } } },
      ]),
      OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: previousWeekStart, $lte: previousWeekEnd },
            order_status: { $nin: ['cancelled', 'returned'] },
          },
        },
        { $group: { _id: null, total: { $sum: '$total_amount' }, orders: { $sum: 1 } } },
      ]),
    ]);

    const currentMonthRevenue = currentMonth[0]?.total || 0;
    const previousMonthRevenue = previousMonth[0]?.total || 0;
    const currentWeekRevenue = currentWeek[0]?.total || 0;
    const previousWeekRevenue = previousWeek[0]?.total || 0;

    return {
      monthly: {
        current: currentMonthRevenue,
        previous: previousMonthRevenue,
        change: previousMonthRevenue > 0
          ? Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100)
          : 0,
        orders: {
          current: currentMonth[0]?.orders || 0,
          previous: previousMonth[0]?.orders || 0,
        },
      },
      weekly: {
        current: currentWeekRevenue,
        previous: previousWeekRevenue,
        change: previousWeekRevenue > 0
          ? Math.round(((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100)
          : 0,
        orders: {
          current: currentWeek[0]?.orders || 0,
          previous: previousWeek[0]?.orders || 0,
        },
      },
    };
  }
}
