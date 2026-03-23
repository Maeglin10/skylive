import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockUserDto } from './dto/block-user.dto';
import { CreateBanDto } from './dto/create-ban.dto';

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async listBlocks(userId: string) {
    return this.prisma.blocklist.findMany({
      where: { userId },
      include: { blockedUser: { select: { id: true, email: true, displayName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async blockUser(userId: string, blockedUserId: string, dto: BlockUserDto) {
    if (userId === blockedUserId) {
      throw new ForbiddenException('Cannot block yourself');
    }

    return this.prisma.blocklist.upsert({
      where: { userId_blockedUserId: { userId, blockedUserId } },
      update: { reason: dto.reason ?? null },
      create: { userId, blockedUserId, reason: dto.reason ?? null },
    });
  }

  async unblockUser(userId: string, blockedUserId: string) {
    await this.prisma.blocklist.deleteMany({ where: { userId, blockedUserId } });
    return { success: true };
  }

  async listBans() {
    return this.prisma.ban.findMany({
      include: {
        user: { select: { id: true, email: true, displayName: true } },
        createdBy: { select: { id: true, email: true, displayName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBan(adminId: string, dto: CreateBanDto) {
    if (adminId === dto.userId) {
      throw new ForbiddenException('Cannot ban yourself');
    }

    return this.prisma.ban.create({
      data: {
        userId: dto.userId,
        reason: dto.reason ?? null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        createdById: adminId,
      },
    });
  }

  async revokeBan(id: string) {
    await this.prisma.ban.delete({ where: { id } });
    return { success: true };
  }
}
