import http from 'http';

import { connectDB } from './config/db';

import app from './app/app';
import secret from './app/secret';
import { logger } from './utils/logger';

const PORT = secret.port;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logger.info({
        message: `Server is running on http://localhost:${PORT}`,
      });
    });
  } catch (error) {
    logger.error({
      message: 'Failed to connect to the database or start the server:',
      status: 500,
      name: error instanceof Error ? error.name : 'UnknownError',
      stack: error instanceof Error ? error.stack : 'No stack trace available',
    });

    process.exit(1);
  }
};
startServer();
