import { Request, Response, Router } from 'express';
import createError from 'http-errors';

import errorHandler from '../middlewares/error-handler';
import { register } from '../middlewares/matrics-middleware';
import authRouter from '../modules/auth/auth.route';
import bannerRouter from '../modules/banner/banner.route';
import brandRouter from '../modules/brand/brand.route';
import cartRouter from '../modules/cart/cart.route';
import categoryRouter from '../modules/category/category.route';
import productRouter from '../modules/product/product.route';
import storeRouter from '../modules/store/store.route';
import userRouter from '../modules/user/user.route';
import wishlistRouter from '../modules/wishlist/wishlist.route';
import { asyncHandler } from '../utils/async-handler';
import { successResponse } from '../utils/response-handler';

const router = Router();

// home route
router.get('/', (_: Request, res: Response) => {
  successResponse(res, {
    message: 'Welcome to the IoT Backend Service.',
    statusCode: 200,
  });
});

// health check route
router.get('/health', (_: Request, res: Response) => {
  successResponse(res, {
    message: 'Service is running smoothly!',
    statusCode: 200,
  });
});

// metrics route
router.get(
  '/metrics',
  asyncHandler(async (_: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  }),
);

// auth routes
router.use('/api/v1/auth', authRouter);

// user routes
router.use('/api/v1/users', userRouter);

// brand routes
router.use('/api/v1/brands', brandRouter);

// category routes
router.use('/api/v1/categories', categoryRouter);

// product routes
router.use('/api/v1/products', productRouter);

// cart routes
router.use('/api/v1/carts', cartRouter);

// wishlist routes
router.use('/api/v1/wishlist', wishlistRouter);

// store routes
router.use('/api/v1/stores', storeRouter);

// banner routes
router.use('/api/v1/banners', bannerRouter);

// 404 route
router.use('', (req: Request, _res: Response) => {
  throw createError.NotFound(
    `Did not find the requested resource- ${req.originalUrl}`,
  );
});

// error handler
router.use(errorHandler);

export default router;
