import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import * as OrderController from './order.controller';
import {
  cancelOrderSchema,
  createOrderSchema,
  deleteOrderSchema,
  getOrderByIdSchema,
  getOrderByTrackingSchema,
  getOrdersQuerySchema,
  getOrderStatsSchema,
  getUserOrdersSchema,
  refundOrderSchema,
  returnOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
  updateTrackingSchema,
} from './order.validation';

const router = Router();

// Authenticated user routes
router.post(
  '/',
  isLoggedIn,
  validate(createOrderSchema),
  OrderController.createOrder,
);

router.get(
  '/',
  isLoggedIn,
  validate(getOrdersQuerySchema),
  OrderController.listOrders,
);

router.get(
  '/stats',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(getOrderStatsSchema),
  OrderController.getOrderStats,
);

router.get(
  '/report',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(getOrderStatsSchema),
  OrderController.getOrderReport,
);

router.get(
  '/tracking/:tracking_number',
  isLoggedIn,
  validate(getOrderByTrackingSchema),
  OrderController.getOrderByTracking,
);

router.get(
  '/user/:user_id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(getUserOrdersSchema),
  OrderController.getUserOrders,
);

router.get(
  '/:id',
  isLoggedIn,
  validate(getOrderByIdSchema),
  OrderController.getOrderById,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateOrderSchema),
  OrderController.updateOrder,
);

router.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateOrderStatusSchema),
  OrderController.updateOrderStatus,
);

router.post(
  '/:id/cancel',
  isLoggedIn,
  validate(cancelOrderSchema),
  OrderController.cancelOrder,
);

router.post(
  '/:id/return',
  isLoggedIn,
  validate(returnOrderSchema),
  OrderController.returnOrder,
);

router.post(
  '/:id/refund',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(refundOrderSchema),
  OrderController.refundOrder,
);

router.post(
  '/:id/track',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateTrackingSchema),
  OrderController.updateTracking,
);

router.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(deleteOrderSchema),
  OrderController.deleteOrder,
);

export default router;
