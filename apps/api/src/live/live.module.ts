import { Module } from '@nestjs/common';
import { LiveService } from './live.service';
import { LiveController } from './live.controller';
import { JobsModule } from '../jobs/jobs.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [JobsModule, EventsModule],
  providers: [LiveService],
  controllers: [LiveController],
  exports: [LiveService],
})
export class LiveModule {}
