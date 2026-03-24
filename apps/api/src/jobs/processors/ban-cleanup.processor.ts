import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('maintenance')
export class BanCleanupProcessor {
  private readonly logger = new Logger(BanCleanupProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('banCleanup')
  async handleBanCleanup(_job: Job) {
    const now = new Date();
    const result = await this.prisma.ban.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    if (result.count > 0) {
      this.logger.log(`Removed ${result.count} expired bans`);
    }
  }
}
