import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccessRule } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
  ) {}

  private async getCreatorId(userId: string) {
    const creator = await this.prisma.creator.findUnique({ where: { userId } });
    if (!creator) throw new ForbiddenException('Creator profile required');
    return creator.id;
  }

  async create(userId: string, dto: CreateContentDto) {
    const creatorId = await this.getCreatorId(userId);
    const content = await this.prisma.content.create({
      data: {
        creatorId,
        type: dto.type,
        mediaKey: dto.mediaKey ?? null,
        text: dto.text ?? null,
        accessRule: dto.accessRule ?? 'FREE',
        price: dto.price ?? null,
      },
    });

    await this.jobsService.trackEvent('content.created', {
      contentId: content.id,
      creatorId,
      accessRule: content.accessRule,
      type: content.type,
    });

    return content;
  }

  async getById(userId: string | null, contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      include: { creator: true },
    });
    if (!content) throw new NotFoundException('Content not found');

    const hasAccess = await this.checkAccess(userId, content);
    if (!hasAccess) throw new ForbiddenException('Access denied');

    return content;
  }

  async update(userId: string, contentId: string, dto: UpdateContentDto) {
    const creatorId = await this.getCreatorId(userId);
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content) throw new NotFoundException('Content not found');
    if (content.creatorId !== creatorId) throw new ForbiddenException('Not owner');

    return this.prisma.content.update({
      where: { id: contentId },
      data: {
        text: dto.text,
        mediaKey: dto.mediaKey,
        accessRule: dto.accessRule,
        price: dto.price,
      },
    });
  }

  async remove(userId: string, contentId: string) {
    const creatorId = await this.getCreatorId(userId);
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content) throw new NotFoundException('Content not found');
    if (content.creatorId !== creatorId) throw new ForbiddenException('Not owner');

    await this.prisma.content.delete({ where: { id: contentId } });
    return { success: true };
  }

  async getFeed(userId: string | null, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const content = await this.prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
      include: {
        creator: {
          include: { user: { select: { displayName: true, avatarUrl: true } } },
        },
      },
    });

    const liveSessions = await this.prisma.liveSession.findMany({
      where: { status: 'LIVE' },
      orderBy: { startedAt: 'desc' },
      take: 20,
      include: {
        creator: {
          include: { user: { select: { displayName: true, avatarUrl: true } } },
        },
      },
    });

    const access = await this.buildAccessContext(userId, {
      contentIds: content.map((item) => item.id),
      liveSessionIds: liveSessions.map((item) => item.id),
    });

    return {
      pagination: { page, limit },
      content: content.map((item) => ({
        ...item,
        access: this.computeContentAccess(item, access),
      })),
      liveSessions: liveSessions.map((item) => ({
        ...item,
        access: this.computeLiveAccess(item, access),
      })),
    };
  }

  async getCreatorContent(userId: string | null, username: string, pagination: PaginationDto) {
    const creator = await this.prisma.creator.findUnique({ where: { username } });
    if (!creator) throw new NotFoundException('Creator not found');

    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const content = await this.prisma.content.findMany({
      where: { creatorId: creator.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    });

    const access = await this.buildAccessContext(userId, {
      contentIds: content.map((item) => item.id),
      liveSessionIds: [],
    });

    return content.map((item) => ({
      ...item,
      access: this.computeContentAccess(item, access),
    }));
  }

  private async checkAccess(
    userId: string | null,
    content: { creatorId: string; accessRule: AccessRule; id: string },
  ) {
    const access = await this.buildAccessContext(userId, {
      contentIds: [content.id],
      liveSessionIds: [],
    });
    return this.computeContentAccess(content, access).canAccess;
  }

  private async buildAccessContext(
    userId: string | null,
    ids: { contentIds: string[]; liveSessionIds: string[] },
  ) {
    if (!userId) {
      return {
        userId: null,
        creatorId: null as string | null,
        subscriptions: new Set<string>(),
        contentPurchases: new Set<string>(),
        livePurchases: new Set<string>(),
      };
    }

    const creator = await this.prisma.creator.findUnique({ where: { userId } });

    const [subscriptions, contentPurchases, livePurchases] = await Promise.all([
      this.prisma.subscription.findMany({
        where: { userId, status: 'ACTIVE' },
        select: { creatorId: true },
      }),
      ids.contentIds.length
        ? this.prisma.purchase.findMany({
            where: { userId, contentId: { in: ids.contentIds } },
            select: { contentId: true },
          })
        : Promise.resolve([]),
      ids.liveSessionIds.length
        ? this.prisma.purchase.findMany({
            where: { userId, liveSessionId: { in: ids.liveSessionIds } },
            select: { liveSessionId: true },
          })
        : Promise.resolve([]),
    ]);

    return {
      userId,
      creatorId: creator?.id ?? null,
      subscriptions: new Set(subscriptions.map((sub) => sub.creatorId)),
      contentPurchases: new Set(contentPurchases.map((purchase) => purchase.contentId!).filter(Boolean)),
      livePurchases: new Set(livePurchases.map((purchase) => purchase.liveSessionId!).filter(Boolean)),
    };
  }

  private computeContentAccess(
    content: { creatorId: string; accessRule: AccessRule; id: string; price?: number | null },
    ctx: {
      userId: string | null;
      creatorId: string | null;
      subscriptions: Set<string>;
      contentPurchases: Set<string>;
      livePurchases: Set<string>;
    },
  ) {
    if (content.accessRule === 'FREE') return { canAccess: true, rule: content.accessRule };
    if (!ctx.userId) return { canAccess: false, rule: content.accessRule, price: content.price ?? null };
    if (ctx.creatorId && ctx.creatorId === content.creatorId) {
      return { canAccess: true, rule: content.accessRule };
    }
    if (content.accessRule === 'SUBSCRIPTION') {
      return {
        canAccess: ctx.subscriptions.has(content.creatorId),
        rule: content.accessRule,
        price: content.price ?? null,
      };
    }
    if (content.accessRule === 'PPV') {
      return {
        canAccess: ctx.contentPurchases.has(content.id),
        rule: content.accessRule,
        price: content.price ?? null,
      };
    }
    return { canAccess: false, rule: content.accessRule, price: content.price ?? null };
  }

  private computeLiveAccess(
    session: { creatorId: string; accessRule: AccessRule; id: string; price?: number | null },
    ctx: {
      userId: string | null;
      creatorId: string | null;
      subscriptions: Set<string>;
      contentPurchases: Set<string>;
      livePurchases: Set<string>;
    },
  ) {
    if (session.accessRule === 'FREE') return { canAccess: true, rule: session.accessRule };
    if (!ctx.userId)
      return { canAccess: false, rule: session.accessRule, price: session.price ?? null };
    if (ctx.creatorId && ctx.creatorId === session.creatorId) {
      return { canAccess: true, rule: session.accessRule };
    }
    if (session.accessRule === 'SUBSCRIPTION') {
      return { canAccess: ctx.subscriptions.has(session.creatorId), rule: session.accessRule };
    }
    if (session.accessRule === 'PPV') {
      return {
        canAccess: ctx.livePurchases.has(session.id),
        rule: session.accessRule,
        price: session.price ?? null,
      };
    }
    return { canAccess: false, rule: session.accessRule };
  }
}
