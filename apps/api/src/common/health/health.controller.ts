import { Controller, Get, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { REDIS_CLIENT } from '../redis';
import type Redis from 'ioredis';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis | null,
  ) {}

  @Get()
  async getHealth() {
    const result: Record<string, unknown> = { status: 'ok' };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      result.db = 'up';
    } catch (error) {
      result.db = 'down';
      result.status = 'error';
      result.dbError = error instanceof Error ? error.message : String(error);
    }

    if (this.redis) {
      try {
        const pong = await this.redis.ping();
        result.redis = pong === 'PONG' ? 'up' : 'degraded';
      } catch (error) {
        result.redis = 'down';
        result.status = 'error';
        result.redisError = error instanceof Error ? error.message : String(error);
      }
    } else {
      result.redis = 'disabled';
    }

    return result;
  }
}
