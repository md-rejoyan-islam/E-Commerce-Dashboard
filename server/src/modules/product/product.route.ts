/**
 * Product Routes
 *
 * Image Upload Guide:
 * -------------------
 * When creating or updating a product with variants, you can upload:
 * 1. Variant images - use field names 'variant_0_images', 'variant_1_images', etc.
 *
 * Example using FormData (for Postman/Frontend):
 *
 * FormData fields:
 * - name: "Product Name"
 * - description: "Product description"
 * - category: "categoryObjectId"
 * - brand: "brandObjectId"
 * - slug: "product-slug" (optional)
 * - featured: "true" or "false"
 * - is_active: "true" or "false"
 * - variants: JSON.stringify([{...}, {...}])  // Array of variant objects
 * - variant_0_images: [file1, file2]  // Images for first variant (index 0)
 * - variant_1_images: [file3]  // Images for second variant (index 1)
 *
 * Variant object structure in JSON:
 * {
 *   "sku": "SKU-001",
 *   "attributes": {"color": "red", "size": "M"},
 *   "price": 1000,
 *   "sale_price": 800,
 *   "inventory": {
 *     "quantity_available": 100,
 *     "quantity_reserved": 0,
 *     "quantity_damaged": 0
 *   }
 * }
 */

import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import {
  productVariantImageUploader,
  productWithVariantsUploader,
} from '../../utils/multer';
import * as ProductController from './product.controller';
import {
  addFAQSchema,
  addReviewSchema,
  addVariantSchema,
  changeStatusSchema,
  createProductSchema,
  getProductByIdSchema,
  getProductsQuerySchema,
  linkCampaignsSchema,
  linkOffersSchema,
  unlinkCampaignSchema,
  unlinkOfferSchema,
  updateFAQSchema,
  updateInventorySchema,
  updateProductSchema,
  updateReviewSchema,
  updateVariantSchema,
} from './product.validation';

const router = Router();

// Public routes - GET products and individual product
router.get(
  '/',
  validate(getProductsQuerySchema),
  ProductController.getProducts,
);

// Get all reviews across all products
router.get('/reviews', ProductController.getAllReviews);

router.get(
  '/:id',
  validate(getProductByIdSchema),
  ProductController.getProductById,
);

// Admin routes - Product CRUD
// Note: Product image upload supports multiple files
// - Field name: 'images' for product main images
// - Field names: 'variants[0][images][]', 'variants[1][images][]', etc. for variant images
router.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  productWithVariantsUploader,
  validate(createProductSchema),
  ProductController.createProduct,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  productWithVariantsUploader,
  validate(updateProductSchema),
  ProductController.updateProduct,
);

router.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(changeStatusSchema),
  ProductController.changeProductStatus,
);

router.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  ProductController.deleteProduct,
);

// Admin routes - Variant management
// Note: Variant image upload supports single file
// - Field name: 'image'
// - Uploads variant-specific image
router.post(
  '/:id/variants',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(addVariantSchema),
  productVariantImageUploader,
  ProductController.addVariant,
);

router.put(
  '/:id/variants/:variantId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateVariantSchema),
  productVariantImageUploader,
  ProductController.updateVariant,
);

router.delete(
  '/:id/variants/:variantId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  ProductController.deleteVariant,
);

// Authenticated user routes - Review management
router.post(
  '/:id/reviews',
  isLoggedIn,
  validate(addReviewSchema),
  ProductController.addReview,
);

router.put(
  '/:id/reviews/:reviewId',
  isLoggedIn,
  validate(updateReviewSchema),
  ProductController.updateReview,
);

// Admin routes - Delete review (no ownership check) - must be before /:id/reviews/:reviewId
router.delete(
  '/:id/reviews/:reviewId/admin',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  ProductController.adminDeleteReview,
);

router.delete(
  '/:id/reviews/:reviewId',
  isLoggedIn,
  ProductController.deleteReview,
);

// Admin routes - FAQ management
router.post(
  '/:id/faq',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(addFAQSchema),
  ProductController.addFAQ,
);

router.put(
  '/:id/faq/:faqId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateFAQSchema),
  ProductController.updateFAQ,
);

router.delete(
  '/:id/faq/:faqId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  ProductController.deleteFAQ,
);

// Admin routes - Inventory management
router.patch(
  '/:id/inventory',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateInventorySchema),
  ProductController.updateInventory,
);

// Admin routes - Campaign management
router.post(
  '/:id/campaigns',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(linkCampaignsSchema),
  ProductController.linkCampaigns,
);

router.delete(
  '/:id/campaigns/:campaignId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(unlinkCampaignSchema),
  ProductController.unlinkCampaign,
);

// Admin routes - Offer management
router.post(
  '/:id/offers',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(linkOffersSchema),
  ProductController.linkOffers,
);

router.delete(
  '/:id/offers/:offerId',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(unlinkOfferSchema),
  ProductController.unlinkOffer,
);

export default router;
