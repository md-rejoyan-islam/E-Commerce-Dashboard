import fs from 'fs';
import secret from '../app/secret';
import { logger } from './logger';

export const removeImage = (url: string) => {
  const imagePath = url.split(secret.server_url).pop() as string;

  fs.unlink(process.cwd() + imagePath, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      logger.error('Error deleting image', {
        error: err,
        imagePath,
      });
    } else {
      logger.info(`Image deleted successfully`, {
        imagePath,
      });
    }
  });
};

export const generateImagePath = (filename: string, folder: string) => {
  return `${secret.server_url}/${folder}/${filename}`;
};
