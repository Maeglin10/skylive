import { Global, Module } from '@nestjs/common';
import { RedisClientProvider, REDIS_CLIENT } from './redis.provider';

/**
 * Global module that provides a shared ioredis client for infrastructure
 * services: throttling, distributed locks, Socket.IO adapter, etc.
 *
 * Import this module once in AppModule. All other modules can inject
 * the client via `@Inject(REDIS_CLIENT) redis: Redis | null`.
 */
@Global()
@Module({
  providers: [RedisClientProvider],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
