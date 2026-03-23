import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('events')
export class EventProcessor {
  private readonly logger = new Logger(EventProcessor.name);

  @Process('event')
  async handleEvent(job: Job<{ type: string; payload: Record<string, unknown> }>) {
    this.logger.log(`Event job: ${job.data.type}`);
  }
}
