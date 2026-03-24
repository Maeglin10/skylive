import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('events')
export class EventProcessor {
  private readonly logger = new Logger(EventProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('event')
  async handleEvent(job: Job<{ type: string; payload: Record<string, unknown> }>) {
    const payload = job.data.payload ?? {};
    const userId = typeof payload.userId === 'string' ? payload.userId : undefined;

    await this.prisma.eventLog.create({
      data: {
        type: job.data.type,
        payload: payload,
        userId,
      },
    });

    this.logger.log(`Event job persisted: ${job.data.type}`);
  }
}
