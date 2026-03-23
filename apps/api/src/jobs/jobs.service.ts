import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
  constructor(@InjectQueue('events') private readonly eventsQueue: Queue) {}

  async trackEvent(type: string, payload: Record<string, unknown>) {
    await this.eventsQueue.add(
      'event',
      { type, payload, createdAt: new Date().toISOString() },
      { attempts: 3, backoff: 1000, removeOnComplete: true },
    );
  }
}
