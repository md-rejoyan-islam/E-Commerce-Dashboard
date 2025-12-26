import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import { offerImageUploader } from '../../utils/multer';
import * as OfferController from './offer.controller';
import {
  createOfferSchema,
  deleteOfferSchema,
  getOfferByIdSchema,
  getOffersQuerySchema,
  updateOfferSchema,
  updateOfferStatusSchema,
} from './offer.validation';

const router = Router();

// Public routes
router.get('/', validate(getOffersQuerySchema), OfferController.listOffers);

router.get('/:id', validate(getOfferByIdSchema), OfferController.getOfferById);

// Admin routes
router.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(createOfferSchema),
  offerImageUploader,
  OfferController.createOffer,
);

router.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateOfferSchema),
  offerImageUploader,
  OfferController.updateOffer,
);

router.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateOfferStatusSchema),
  OfferController.updateOfferStatus,
);

router.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(deleteOfferSchema),
  OfferController.deleteOffer,
);

export default router;
