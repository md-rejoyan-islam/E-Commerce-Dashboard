import { Request, Response, Router } from 'express';
import createError from 'http-errors';

import errorHandler from '../middlewares/error-handler';
import { register } from '../middlewares/matrics-middleware';
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
// router.use('/api/v1/auth', authRouter);

// 404 route
router.use('', (req: Request, _res: Response) => {
  throw createError.NotFound(
    `Did not find the requested resource- ${req.originalUrl}`,
  );
});

// error handler
router.use(errorHandler);

export default router;
