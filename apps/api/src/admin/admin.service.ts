import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateContentModerationDto } from './dto/update-content-moderation.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      userCount,
      creatorCount,
      contentCount,
      liveCount,
      activeSubscriptions,
      purchaseRevenue,
      tipRevenue,
      openReports,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.creator.count(),
      this.prisma.content.count(),
      this.prisma.liveSession.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.purchase.aggregate({ _sum: { amount: true } }),
      this.prisma.tip.aggregate({ _sum: { amount: true } }),
      this.prisma.report.count({ where: { status: 'OPEN' } }),
    ]);

    return {
      users: userCount,
      creators: creatorCount,
      content: contentCount,
      liveSessions: liveCount,
      activeSubscriptions,
      revenue: {
        purchases: purchaseRevenue._sum.amount ?? 0,
        tips: tipRevenue._sum.amount ?? 0,
        total: (purchaseRevenue._sum.amount ?? 0) + (tipRevenue._sum.amount ?? 0),
      },
      reports: {
        open: openReports,
      },
    };
  }

  async updateContentModeration(contentId: string, dto: UpdateContentModerationDto) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content) throw new NotFoundException('Content not found');

    return this.prisma.content.update({
      where: { id: contentId },
      data: {
        isHidden: dto.isHidden,
        hiddenReason: dto.isHidden ? dto.reason ?? null : null,
        hiddenAt: dto.isHidden ? new Date() : null,
      },
    });
  }
}
