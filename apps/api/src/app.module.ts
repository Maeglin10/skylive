import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, RequestTimeoutMiddleware).forRoutes('*');
  }
}
