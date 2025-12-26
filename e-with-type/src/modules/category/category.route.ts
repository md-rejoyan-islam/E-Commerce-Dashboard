import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import { categoryImageUploader } from '../../utils/multer';
import * as CategoryController from './category.controller';
import {
  changeStatusSchema,
  createCategorySchema,
  getCategoriesQuerySchema,
  getCategoryByIdSchema,
  updateCategorySchema,
} from './category.validation';

const router = Router();

// Public routes
router.get(
  '/',
  validate(getCategoriesQuerySchema),
  CategoryController.getCategories,
);
router.get('/with-children', CategoryController.getCategoriesWithChildren);
router.get(
  '/:id',
  validate(getCategoryByIdSchema),
  CategoryController.getCategoryById,
);

// Admin only routes
router.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  categoryImageUploader,
  validate(createCategorySchema),
  CategoryController.createCategory,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  categoryImageUploader,
  validate(updateCategorySchema),
  CategoryController.updateCategory,
);

router.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(changeStatusSchema),
  CategoryController.changeCategoryStatus,
);

router.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  CategoryController.deleteCategory,
);

export default router;
