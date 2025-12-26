import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import { brandLogoUploader } from '../../utils/multer';
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
  getBrandByIdSchema,
  getBrandsQuerySchema,
  updateBrandSchema,
} from './brand.validation';

const router = Router();

// Public routes
router.get('/', validate(getBrandsQuerySchema), getBrands);
router.get('/:id', validate(getBrandByIdSchema), getBrandById);

// Admin only routes
router.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  brandLogoUploader,
  validate(createBrandSchema),
  createBrand,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  brandLogoUploader,
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
