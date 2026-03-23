import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportTargetType, ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(userId: string, dto: CreateReportDto) {
    const target = await this.resolveTarget(dto.targetType, dto.targetId);

    return this.prisma.report.create({
      data: {
        reporterId: userId,
        targetType: dto.targetType,
        targetUserId: target.type === 'USER' ? target.id : null,
        targetContentId: target.type === 'CONTENT' ? target.id : null,
        targetLiveSessionId: target.type === 'LIVE' ? target.id : null,
        targetMessageId: target.type === 'MESSAGE' ? target.id : null,
        reason: dto.reason,
        details: dto.details ?? null,
      },
    });
  }

  async listReports(status?: ReportStatus) {
    return this.prisma.report.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, email: true, displayName: true, role: true } },
        targetUser: { select: { id: true, email: true, displayName: true } },
        targetContent: { select: { id: true, creatorId: true, accessRule: true } },
        targetLiveSession: { select: { id: true, creatorId: true, status: true } },
        targetMessage: { select: { id: true, chatRoomId: true } },
      },
    });
  }

  private async resolveTarget(type: ReportTargetType, id: string) {
    switch (type) {
      case 'USER': {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('Target user not found');
        return { type, id: user.id };
      }
      case 'CONTENT': {
        const content = await this.prisma.content.findUnique({ where: { id } });
        if (!content) throw new NotFoundException('Target content not found');
        return { type, id: content.id };
      }
      case 'LIVE': {
        const live = await this.prisma.liveSession.findUnique({ where: { id } });
        if (!live) throw new NotFoundException('Target live session not found');
        return { type, id: live.id };
      }
      case 'MESSAGE': {
        const message = await this.prisma.message.findUnique({ where: { id } });
        if (!message) throw new NotFoundException('Target message not found');
        return { type, id: message.id };
      }
      default:
        throw new NotFoundException('Invalid report target');
    }
  }
}
