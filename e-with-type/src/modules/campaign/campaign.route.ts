import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import { campaignImageUploader } from '../../utils/multer';
import * as CampaignController from './campaign.controller';
import {
  createCampaignSchema,
  deleteCampaignSchema,
  getCampaignByIdSchema,
  getCampaignsQuerySchema,
  updateCampaignSchema,
  updateCampaignStatusSchema,
} from './campaign.validation';

const router = Router();

// Public routes
router.get(
  '/',
  validate(getCampaignsQuerySchema),
  CampaignController.listCampaigns,
);

router.get(
  '/:id',
  validate(getCampaignByIdSchema),
  CampaignController.getCampaignById,
);

// Admin routes
router.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  campaignImageUploader,
  validate(createCampaignSchema),
  CampaignController.createCampaign,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  campaignImageUploader,
  validate(updateCampaignSchema),
  CampaignController.updateCampaign,
);

router.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateCampaignStatusSchema),
  CampaignController.updateCampaignStatus,
);

router.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(deleteCampaignSchema),
  CampaignController.deleteCampaign,
);

export default router;
