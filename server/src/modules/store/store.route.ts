import { Router } from 'express';
import { authorize } from '../../middlewares/authorized';
import validate from '../../middlewares/validate';
import { isLoggedIn } from '../../middlewares/verify';
import { storeImageUploader } from '../../utils/multer';
import * as StoreController from './store.controller';
import {
  createStoreSchema,
  deleteStoreSchema,
  getStoreByIdSchema,
  getStoresQuerySchema,
  updateStoreSchema,
  updateStoreStatusSchema,
} from './store.validation';

const storeRouter = Router();

// Public routes
storeRouter.get(
  '/',
  validate(getStoresQuerySchema),
  StoreController.listStores,
);

storeRouter.get(
  '/:id',
  validate(getStoreByIdSchema),
  StoreController.getStoreById,
);

// Admin routes
storeRouter.post(
  '/',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  storeImageUploader,
  validate(createStoreSchema),
  StoreController.createStore,
);

storeRouter.put(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  storeImageUploader,
  validate(updateStoreSchema),
  StoreController.updateStore,
);

storeRouter.patch(
  '/:id/status',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(updateStoreStatusSchema),
  StoreController.updateStoreStatus,
);

storeRouter.delete(
  '/:id',
  isLoggedIn,
  authorize(['admin', 'superadmin']),
  validate(deleteStoreSchema),
  StoreController.deleteStore,
);

export default storeRouter;
