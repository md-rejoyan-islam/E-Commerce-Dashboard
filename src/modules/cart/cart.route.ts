import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import * as CartController from './cart.controller';
import {
  addItemToCartSchema,
  clearUserCartSchema,
  getAllCartsSchema,
  getCartSchema,
  getUserCartSchema,
  removeCartItemSchema,
  updateCartItemSchema,
} from './cart.validation';

const router = Router();

// User routes - require authentication
router.get('/', isLoggedIn, validate(getCartSchema), CartController.getCart);

router.post(
  '/items',
  isLoggedIn,
  validate(addItemToCartSchema),
  CartController.addItem,
);

router.put(
  '/items/:itemId',
  isLoggedIn,
  validate(updateCartItemSchema),
  CartController.updateItem,
);

router.delete(
  '/items/:itemId',
  isLoggedIn,
  validate(removeCartItemSchema),
  CartController.removeItem,
);

router.delete('/', isLoggedIn, CartController.clearCart);

// Admin routes
router.get(
  '/all',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(getAllCartsSchema),
  CartController.getAllCarts,
);

router.get(
  '/user/:userId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(getUserCartSchema),
  CartController.getUserCart,
);

router.delete(
  '/user/:userId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(clearUserCartSchema),
  CartController.clearUserCart,
);

export default router;
