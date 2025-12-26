import { Request, Response, Router } from 'express';
import createError from 'http-errors';

import fs from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import errorHandler from '../middlewares/error-handler';
import { register } from '../middlewares/matrics-middleware';
import analyticsRouter from '../modules/analytics/analytics.route';
import authRouter from '../modules/auth/auth.route';
import bannerRouter from '../modules/banner/banner.route';
import brandRouter from '../modules/brand/brand.route';
import campaignRouter from '../modules/campaign/campaign.route';
import cartRouter from '../modules/cart/cart.route';
import categoryRouter from '../modules/category/category.route';
import couponRouter from '../modules/coupon/coupon.route';
import offerRouter from '../modules/offer/offer.route';
import orderRouter from '../modules/order/order.route';
import productRouter from '../modules/product/product.route';
import storeRouter from '../modules/store/store.route';
import userRouter from '../modules/user/user.route';
import wishlistRouter from '../modules/wishlist/wishlist.route';
import { asyncHandler } from '../utils/async-handler';
import { successResponse } from '../utils/response-handler';

const yamltoJson = yaml.load(
  fs.readFileSync(path.join(process.cwd(), 'docs', 'openapi.yaml'), 'utf8'),
);

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

// Serve Swagger UI at /docs using the loaded document
router.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(yamltoJson as object, {
    explorer: true,
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

// campaign routes
router.use('/api/v1/campaigns', campaignRouter);

// coupon routes
router.use('/api/v1/coupons', couponRouter);

// offer routes
router.use('/api/v1/offers', offerRouter);

// order routes
router.use('/api/v1/orders', orderRouter);

// analytics routes
router.use('/api/v1/analytics', analyticsRouter);

// 404 route
router.use('', (req: Request, _res: Response) => {
  throw createError.NotFound(
    `Did not find the requested resource- ${req.originalUrl}`,
  );
});

// error handler
router.use(errorHandler);

export default router;
