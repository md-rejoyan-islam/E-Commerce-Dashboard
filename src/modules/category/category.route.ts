import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import multerUploader from '../../utils/multer';
import * as CategoryController from './category.controller';
import {
  changeStatusSchema,
  createCategorySchema,
  getCategoriesQuerySchema,
  getCategoryByIdSchema,
  updateCategorySchema,
} from './category.validation';

const categoryImageUpload = multerUploader({
  uploadPath: 'public/uploads/categories',
  maxSize: 0.2, // 200KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'image',
});

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
  validate(createCategorySchema),
  categoryImageUpload,
  CategoryController.createCategory,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateCategorySchema),
  categoryImageUpload,
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
