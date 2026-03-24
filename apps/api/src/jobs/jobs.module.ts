import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsService } from './jobs.service';
import { EventProcessor } from './processors/event.processor';
import { BanCleanupProcessor } from './processors/ban-cleanup.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'events',
    }),
    BullModule.registerQueue({
      name: 'maintenance',
    }),
  ],
  providers: [JobsService, EventProcessor, BanCleanupProcessor],
  exports: [JobsService],
})
export class JobsModule {}
