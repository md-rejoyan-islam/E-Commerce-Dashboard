import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import morgan, { StreamOptions } from 'morgan';
import path from 'path';

import corsOptions from '../config/cors';
import limiter from '../config/rate-limiter';
import { metricsMiddleware } from '../middlewares/matrics-middleware';
import router from '../routes';
import { logger } from '../utils/logger';

const app: Application = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// matrics middleware
app.use(metricsMiddleware);

// cookie parser middleware
app.use(cookieParser());

// serve static files
app.use('/public', express.static(path.join(process.cwd(), '/public/')));

// CORS configuration
app.use(cors(corsOptions));
// for vps hosting
// app.use(cors({ origin: secret.client_url, credentials: true }));

const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

// morgan
if (process.env.NODE_ENV === 'development') {
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream,
    }),
  );
}

// rate limiter
app.use(limiter);

// Handle favicon requests
app.get('/favicon.ico', (_req: Request, res: Response) =>
  res.status(204).end(),
);

app.use(router);

export default app;
