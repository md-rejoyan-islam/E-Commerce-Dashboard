import * as crypto from 'crypto';
import createHttpError from 'http-errors';
import { redisClient } from '../config/redis';
import { logger } from './logger';

export interface CacheKeyParams {
  resource: string; // (e.g., "product", "users", "products:232")
  query?: { [key: string]: unknown }; // e.g., { color: "red", sortBy: "price", includeOutOfStock: false
}

function sortObjectKeys(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }

  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: { [key: string]: unknown } = {};

  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys((obj as { [key: string]: unknown })[key]); // Recurse for nested objects
  }
  return sortedObj;
}

export function generateCacheKey(params: CacheKeyParams): string {
  const keyData = {
    resource: params.resource,
    query: sortObjectKeys(params.query || {}),
  };

  try {
    const serializedData = JSON.stringify(keyData);

    const hash = crypto
      .createHash('sha256')
      .update(serializedData)
      .digest('hex');

    // Prefix with resource name for pattern-based deletion
    return `${params.resource}:${hash}`;
  } catch (error) {
    logger.error(`Error generating cache key: ${error}`);
    throw createHttpError(500, 'Failed to generate cache key');
  }
}

export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number = 2592000, // Default TTL: 30 days 2592000,
): Promise<void> {
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    logger.warn(`Failed to set cache for key: ${key}. Error: ${error}`);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }
    return null;
  } catch (error) {
    logger.warn(`Failed to get cache for key: ${key}. Error: ${error}`);
    return null;
  }
}

export async function deleteCache(pattern: string): Promise<void> {
  try {
    // Check if pattern contains wildcard
    if (pattern.includes('*')) {
      // Use KEYS to find all matching keys and delete them one by one
      const keys = await redisClient.keys(pattern);
      for (const key of keys) {
        await redisClient.del(key);
      }
    } else {
      // Direct delete for exact key
      await redisClient.del(pattern);
    }
  } catch (error) {
    logger.warn(
      `Failed to delete cache for pattern: ${pattern}. Error: ${error}`,
    );
  }
}

export async function clearCache(): Promise<void> {
  try {
    await redisClient.flushAll();
  } catch (error) {
    logger.warn(`Failed to clear cache. Error: ${error}`);
  }
}
