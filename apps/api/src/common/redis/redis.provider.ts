import { Provider, Logger } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Injection token for the shared Redis client used by infrastructure services
 * (throttling, distributed locks, Socket.IO adapter, etc.)
 */
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

const logger = new Logger('RedisProvider');

/**
 * Creates a shared ioredis client from environment variables.
 *
 * Returns `null` when no Redis configuration is detected so that
 * consumers can gracefully fall back to in-memory implementations.
 */
export const RedisClientProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (): Redis | null => {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;

    if (!redisUrl && !redisHost && !redisPort) {
      logger.warn(
        'No Redis configuration found (REDIS_URL / REDIS_HOST / REDIS_PORT). ' +
          'Infrastructure services will use in-memory fallbacks.',
      );
      return null;
    }

    let client: Redis;

    if (redisUrl) {
      client = new Redis(redisUrl, {
        connectionName: 'skylive:infra',
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => Math.min(times * 200, 5_000),
        lazyConnect: true,
      });
    } else {
      const host = redisHost || 'localhost';
      const port = parseInt(redisPort || '6379', 10);
      const password = process.env.REDIS_PASSWORD;
      const useTls = process.env.REDIS_TLS === 'true';

      client = new Redis({
        host,
        port,
        password: password || undefined,
        tls: useTls ? {} : undefined,
        connectionName: 'skylive:infra',
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => Math.min(times * 200, 5_000),
        lazyConnect: true,
      });
    }

    let lastErrorLog = 0;
    client.on('error', (err) => {
      const now = Date.now();
      if (now - lastErrorLog > 60_000) {
        logger.error(`Redis infrastructure client error: ${err.message}`);
        lastErrorLog = now;
      }
    });

    client.on('connect', () => {
      logger.log('Redis infrastructure client connected');
    });

    client.connect().catch((err: Error) => {
      logger.warn(
        `Redis infrastructure client initial connect failed (will retry on demand): ${err.message}`,
      );
    });

    return client;
  },
};
