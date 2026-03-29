import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET || 'dev_secret' })],
  providers: [EventsService, NotificationsGateway],
  controllers: [EventsController],
  exports: [NotificationsGateway],
})
export class EventsModule {}
