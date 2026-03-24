import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService implements OnModuleInit {
  constructor(
    @InjectQueue('events') private readonly eventsQueue: Queue,
    @InjectQueue('maintenance') private readonly maintenanceQueue: Queue,
  ) {}

  async onModuleInit() {
    const existing = await this.maintenanceQueue.getRepeatableJobs();
    const hasCleanup = existing.some((job) => job.name === 'banCleanup');
    const hasRefreshCleanup = existing.some((job) => job.name === 'refreshTokenCleanup');
    if (!hasCleanup) {
      await this.maintenanceQueue.add(
        'banCleanup',
        {},
        { repeat: { every: 60 * 60 * 1000 }, removeOnComplete: true },
      );
    }
    if (!hasRefreshCleanup) {
      await this.maintenanceQueue.add(
        'refreshTokenCleanup',
        {},
        { repeat: { every: 60 * 60 * 1000 }, removeOnComplete: true },
      );
    }
  }

  async trackEvent(type: string, payload: Record<string, unknown>) {
    await this.eventsQueue.add(
      'event',
      { type, payload, createdAt: new Date().toISOString() },
      { attempts: 3, backoff: 1000, removeOnComplete: true },
    );
  }
}
