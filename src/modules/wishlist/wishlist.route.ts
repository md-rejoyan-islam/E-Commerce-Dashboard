import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import * as WishlistController from './wishlist.controller';
import {
  addItemToWishlistSchema,
  clearUserWishlistSchema,
  getAllWishlistItemsSchema,
  getUserWishlistSchema,
  getWishlistItemSchema,
  getWishlistSchema,
  removeWishlistItemSchema,
} from './wishlist.validation';

const wishlistRouter = Router();

// Admin routes (must be defined before parameterized routes)
wishlistRouter.get(
  '/all-items',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(getAllWishlistItemsSchema),
  WishlistController.getAllWishlists,
);

wishlistRouter.get(
  '/user/:userId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(getUserWishlistSchema),
  WishlistController.getUserWishlist,
);

wishlistRouter.delete(
  '/user/:userId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(clearUserWishlistSchema),
  WishlistController.clearUserWishlist,
);

// User routes
wishlistRouter.get(
  '/',
  isLoggedIn,
  validate(getWishlistSchema),
  WishlistController.getWishlist,
);

wishlistRouter.post(
  '/',
  isLoggedIn,
  validate(addItemToWishlistSchema),
  WishlistController.addItem,
);

wishlistRouter.get(
  '/:id',
  isLoggedIn,
  validate(getWishlistItemSchema),
  WishlistController.getItem,
);

wishlistRouter.delete(
  '/:id',
  isLoggedIn,
  validate(removeWishlistItemSchema),
  WishlistController.removeItem,
);

wishlistRouter.delete('/', isLoggedIn, WishlistController.clearWishlist);

export default wishlistRouter;
