import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import * as CouponController from './coupon.controller';
import {
  createCouponSchema,
  deleteCouponSchema,
  getCouponByIdSchema,
  getCouponsQuerySchema,
  updateCouponSchema,
  updateCouponStatusSchema,
} from './coupon.validation';

const router = Router();

// Public routes
router.get('/', validate(getCouponsQuerySchema), CouponController.listCoupons);

router.get(
  '/:id',
  validate(getCouponByIdSchema),
  CouponController.getCouponById,
);

// Admin routes
router.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(createCouponSchema),
  CouponController.createCoupon,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateCouponSchema),
  CouponController.updateCoupon,
);

router.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateCouponStatusSchema),
  CouponController.updateCouponStatus,
);

router.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(deleteCouponSchema),
  CouponController.deleteCoupon,
);

export default router;
