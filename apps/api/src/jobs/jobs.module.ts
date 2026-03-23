import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsService } from './jobs.service';
import { EventProcessor } from './processors/event.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'events',
    }),
  ],
  providers: [JobsService, EventProcessor],
  exports: [JobsService],
})
export class JobsModule {}
