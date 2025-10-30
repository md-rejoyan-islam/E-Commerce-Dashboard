import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import * as BannerController from './banner.controller';
import {
  createBannerSchema,
  deleteBannerSchema,
  getBannerByIdSchema,
  getBannersQuerySchema,
  updateBannerSchema,
  updateBannerStatusSchema,
} from './banner.validation';

const bannerRouter = Router();

// Public routes
bannerRouter.get(
  '/',
  validate(getBannersQuerySchema),
  BannerController.listBanners,
);

bannerRouter.get(
  '/:id',
  validate(getBannerByIdSchema),
  BannerController.getBannerById,
);

// Admin routes
bannerRouter.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(createBannerSchema),
  BannerController.createBanner,
);

bannerRouter.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateBannerSchema),
  BannerController.updateBanner,
);

bannerRouter.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateBannerStatusSchema),
  BannerController.updateBannerStatus,
);

bannerRouter.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(deleteBannerSchema),
  BannerController.deleteBanner,
);

export default bannerRouter;
