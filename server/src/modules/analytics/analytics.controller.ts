import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQuery, TopProductsQuery } from './analytics.validation';

export const getDashboardSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await AnalyticsService.getDashboardSummary();
  successResponse(res, {
    statusCode: 200,
    message: 'Dashboard summary fetched',
    payload: { data: summary },
  });
});

export const getSalesAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as AnalyticsQuery;
  const data = await AnalyticsService.getSalesAnalytics(query);
  successResponse(res, {
    statusCode: 200,
    message: 'Sales analytics fetched',
    payload: { data },
  });
});

export const getOrderAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as AnalyticsQuery;
  const data = await AnalyticsService.getOrderAnalytics(query);
  successResponse(res, {
    statusCode: 200,
    message: 'Order analytics fetched',
    payload: { data },
  });
});

export const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as TopProductsQuery;
  const data = await AnalyticsService.getTopProducts(query);
  successResponse(res, {
    statusCode: 200,
    message: 'Top products fetched',
    payload: { data },
  });
});

export const getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
  const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
  const data = await AnalyticsService.getLowStockProducts(threshold);
  successResponse(res, {
    statusCode: 200,
    message: 'Low stock products fetched',
    payload: { data },
  });
});

export const getSalesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as AnalyticsQuery;
  const data = await AnalyticsService.getSalesByCategory(query);
  successResponse(res, {
    statusCode: 200,
    message: 'Sales by category fetched',
    payload: { data },
  });
});

export const getRevenueComparison = asyncHandler(async (_req: Request, res: Response) => {
  const data = await AnalyticsService.getRevenueComparison();
  successResponse(res, {
    statusCode: 200,
    message: 'Revenue comparison fetched',
    payload: { data },
  });
});
