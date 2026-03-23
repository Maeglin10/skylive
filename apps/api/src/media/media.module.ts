import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [ContentModule],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
