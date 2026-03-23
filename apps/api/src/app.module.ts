import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CreatorsModule } from './creators/creators.module';
import { ContentModule } from './content/content.module';
import { MediaModule } from './media/media.module';
import { LiveModule } from './live/live.module';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';
import { HealthModule } from './common/health/health.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { RequestTimeoutMiddleware } from './common/middleware/request-timeout.middleware';
import { ApiThrottlerGuard } from './common/guards/api-throttler.guard';
import { BullModule } from '@nestjs/bull';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      ttl: Number(process.env.THROTTLE_TTL ?? 60),
      limit: Number(process.env.THROTTLE_LIMIT ?? 100),
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL
        ? process.env.REDIS_URL
        : {
            host: process.env.REDIS_HOST ?? 'localhost',
            port: Number(process.env.REDIS_PORT ?? 6379),
            password: process.env.REDIS_PASSWORD || undefined,
          },
    }),
    RedisModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    CreatorsModule,
    ContentModule,
    MediaModule,
    LiveModule,
    ChatModule,
    PaymentsModule,
    HealthModule,
    JobsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, RequestTimeoutMiddleware).forRoutes('*');
  }
}
