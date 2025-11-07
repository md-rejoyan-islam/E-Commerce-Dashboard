import { createClient, RedisClientType } from 'redis';
import secret from '../app/secret';
import { logger } from '../utils/logger';

const redisClient: RedisClientType = createClient({
  url: secret.redis.redis_url,
  //   socket: {
  //     host: secret.redis.redis_host,
  //     port: secret.redis.redis_port,
  //   },
  //   password: secret.redis.redis_password,
});

redisClient.on('error', (err: Error) => {
  console.error('Redis Client Error:', err);
});

async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      logger.info({ message: 'Connected to Redis successfully' });
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }
}

export { connectRedis, redisClient };
