import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('maintenance')
export class RefreshTokenCleanupProcessor {
  private readonly logger = new Logger(RefreshTokenCleanupProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('refreshTokenCleanup')
  async handleCleanup(_job: Job) {
    const now = new Date();
    const result = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    if (result.count > 0) {
      this.logger.log(`Removed ${result.count} expired refresh tokens`);
    }
  }
}
