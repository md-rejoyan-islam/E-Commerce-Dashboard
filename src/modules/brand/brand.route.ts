import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import multerUploader from '../../utils/multer';
import {
  changeBrandStatus,
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from './brand.controller';
import {
  changeStatusSchema,
  createBrandSchema,
  getBrandsQuerySchema,
  updateBrandSchema,
} from './brand.validation';

const router = Router();

const brandLogoUpload = multerUploader({
  uploadPath: 'public/uploads/brands',
  maxSize: 0.3, // 300KB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  single: true,
  fieldName: 'logo',
});

// Public routes
router.get('/', validate(getBrandsQuerySchema), getBrands);
router.get('/:id', getBrandById);

// Admin only routes
router.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  brandLogoUpload,
  validate(createBrandSchema),
  createBrand,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  brandLogoUpload,
  validate(updateBrandSchema),
  updateBrand,
);

router.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(changeStatusSchema),
  changeBrandStatus,
);

router.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  deleteBrand,
);

export default router;
