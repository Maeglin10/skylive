import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnboardCreatorDto } from './dto/onboard-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';

@Injectable()
export class CreatorsService {
  constructor(private readonly prisma: PrismaService) {}

  async onboard(userId: string, dto: OnboardCreatorDto) {
    const existingByUsername = await this.prisma.creator.findUnique({
      where: { username: dto.username },
    });
    if (existingByUsername) {
      throw new ConflictException('Username already taken');
    }

    const existingCreator = await this.prisma.creator.findUnique({ where: { userId } });
    if (existingCreator) {
      return existingCreator;
    }

    const creator = await this.prisma.creator.create({
      data: {
        userId,
        username: dto.username,
        bio: dto.bio ?? null,
        subscriptionPrice: dto.subscriptionPrice ?? null,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'CREATOR' },
    });

    return creator;
  }

  async getStats(userId: string) {
    const creator = await this.prisma.creator.findUnique({ where: { userId } });
    if (!creator) throw new NotFoundException('Creator not found');

    const [subscriptions, tips, purchases] = await Promise.all([
      this.prisma.subscription.count({
        where: { creatorId: creator.id, status: 'ACTIVE' },
      }),
      this.prisma.tip.aggregate({
        where: { creatorId: creator.id },
        _sum: { amount: true },
      }),
      this.prisma.purchase.aggregate({
        where: { content: { creatorId: creator.id } },
        _sum: { amount: true },
      }),
    ]);

    return {
      activeSubscribers: subscriptions,
      totalTips: tips._sum.amount ?? 0,
      totalPurchases: purchases._sum.amount ?? 0,
      totalRevenue: (tips._sum.amount ?? 0) + (purchases._sum.amount ?? 0),
    };
  }

  async getByUsername(username: string) {
    const creator = await this.prisma.creator.findUnique({
      where: { username },
      include: {
        user: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    });
    if (!creator) throw new NotFoundException('Creator not found');
    return creator;
  }

  async updateProfile(userId: string, dto: UpdateCreatorDto) {
    const creator = await this.prisma.creator.findUnique({ where: { userId } });
    if (!creator) throw new NotFoundException('Creator not found');

    return this.prisma.creator.update({
      where: { id: creator.id },
      data: {
        bio: dto.bio,
        subscriptionPrice: dto.subscriptionPrice,
      },
    });
  }
}
