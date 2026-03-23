import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccessRule } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLiveSessionDto } from './dto/create-live-session.dto';

@Injectable()
export class LiveService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCreatorId(userId: string) {
    const creator = await this.prisma.creator.findUnique({ where: { userId } });
    if (!creator) throw new ForbiddenException('Creator profile required');
    return creator.id;
  }

  async createSession(userId: string, dto: CreateLiveSessionDto) {
    const creatorId = await this.getCreatorId(userId);
    const streamKey = randomUUID();

    if (dto.accessRule === 'PPV' && (dto.price === null || dto.price === undefined)) {
      throw new ForbiddenException('PPV live sessions require a price');
    }

    const session = await this.prisma.liveSession.create({
      data: {
        creatorId,
        title: dto.title,
        accessRule: dto.accessRule,
        price: dto.price ?? null,
        streamKey,
        status: 'OFFLINE',
        chatRoom: { create: {} },
      },
    });

    return session;
  }

  async listSessions(status?: string) {
    return this.prisma.liveSession.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSession(userId: string | null, id: string) {
    const session = await this.prisma.liveSession.findUnique({
      where: { id },
      include: { creator: true },
    });
    if (!session) throw new NotFoundException('Live session not found');

    const hasAccess = await this.checkAccess(userId, session);
    if (!hasAccess) throw new ForbiddenException('Access denied');

    return session;
  }

  async startSession(userId: string, id: string) {
    const creatorId = await this.getCreatorId(userId);
    const session = await this.prisma.liveSession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Live session not found');
    if (session.creatorId !== creatorId) throw new ForbiddenException('Not owner');

    return this.prisma.liveSession.update({
      where: { id },
      data: {
        status: 'LIVE',
        startedAt: new Date(),
        hlsUrl: this.buildHlsUrl(session.streamKey),
      },
    });
  }

  async endSession(userId: string, id: string) {
    const creatorId = await this.getCreatorId(userId);
    const session = await this.prisma.liveSession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Live session not found');
    if (session.creatorId !== creatorId) throw new ForbiddenException('Not owner');

    return this.prisma.liveSession.update({
      where: { id },
      data: {
        status: 'ENDED',
        endedAt: new Date(),
      },
    });
  }

  async handleStreamStart(streamKey: string) {
    const session = await this.prisma.liveSession.findUnique({ where: { streamKey } });
    if (!session) throw new NotFoundException('Live session not found');

    return this.prisma.liveSession.update({
      where: { id: session.id },
      data: {
        status: 'LIVE',
        startedAt: new Date(),
        hlsUrl: this.buildHlsUrl(streamKey),
      },
    });
  }

  async handleStreamEnd(streamKey: string) {
    const session = await this.prisma.liveSession.findUnique({ where: { streamKey } });
    if (!session) throw new NotFoundException('Live session not found');

    return this.prisma.liveSession.update({
      where: { id: session.id },
      data: {
        status: 'ENDED',
        endedAt: new Date(),
      },
    });
  }

  async assertLiveAccess(userId: string, liveSessionId: string) {
    const session = await this.prisma.liveSession.findUnique({ where: { id: liveSessionId } });
    if (!session) throw new NotFoundException('Live session not found');

    const hasAccess = await this.checkAccess(userId, session);
    if (!hasAccess) throw new ForbiddenException('Access denied');

    return session;
  }

  private buildHlsUrl(streamKey: string) {
    const base = process.env.HLS_BASE_URL || 'http://localhost:8080/hls';
    return `${base}/${streamKey}.m3u8`;
  }

  private async checkAccess(
    userId: string | null,
    session: { creatorId: string; accessRule: AccessRule; id: string },
  ) {
    if (session.accessRule === 'FREE') return true;
    if (!userId) return false;

    const creator = await this.prisma.creator.findUnique({ where: { userId } });
    if (creator && creator.id === session.creatorId) return true;

    if (session.accessRule === 'SUBSCRIPTION') {
      const subscription = await this.prisma.subscription.findFirst({
        where: { userId, creatorId: session.creatorId, status: 'ACTIVE' },
      });
      return Boolean(subscription);
    }

    if (session.accessRule === 'PPV') {
      const purchase = await this.prisma.purchase.findFirst({
        where: { userId, liveSessionId: session.id },
      });
      return Boolean(purchase);
    }

    return false;
  }
}
