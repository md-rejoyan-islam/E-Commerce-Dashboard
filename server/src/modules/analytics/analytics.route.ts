import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import {
  getDashboardSummary,
  getLowStockProducts,
  getOrderAnalytics,
  getRevenueComparison,
  getSalesAnalytics,
  getSalesByCategory,
  getTopProducts,
} from './analytics.controller';
import {
  analyticsQuerySchema,
  salesAnalyticsSchema,
  topProductsSchema,
} from './analytics.validation';

const router = Router();

// All analytics routes require admin/superadmin access
router.use(isLoggedIn, authorize(['admin', 'superadmin']));

// Dashboard summary - all modules overview
router.get('/summary', getDashboardSummary);

// Sales analytics with time series data
router.get('/sales', validate(salesAnalyticsSchema), getSalesAnalytics);

// Order analytics with status breakdown
router.get('/orders', validate(analyticsQuerySchema), getOrderAnalytics);

// Top selling products
router.get('/products/top', validate(topProductsSchema), getTopProducts);

// Low stock products
router.get('/products/low-stock', getLowStockProducts);

// Sales by category
router.get('/sales/by-category', validate(analyticsQuerySchema), getSalesByCategory);

// Revenue comparison (current vs previous period)
router.get('/revenue/comparison', getRevenueComparison);

export default router;
