import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { LiveModule } from '../live/live.module';

@Module({
  imports: [LiveModule, JwtModule.register({ secret: process.env.JWT_SECRET || 'dev_secret' })],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
