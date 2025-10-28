import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import multerUploader from '../../utils/multer';
import {
  changeCategoryStatus,
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from './category.controller';
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
router.get('/', validate(getCategoriesQuerySchema), getCategories);
router.get('/:id', validate(getCategoryByIdSchema), getCategoryById);

// Admin only routes
router.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(createCategorySchema),
  categoryImageUpload,
  createCategory,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateCategorySchema),
  categoryImageUpload,
  updateCategory,
);

router.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(changeStatusSchema),
  changeCategoryStatus,
);

router.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  deleteCategory,
);

export default router;
