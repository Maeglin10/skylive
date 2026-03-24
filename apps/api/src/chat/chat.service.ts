import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(liveSessionId: string, userId: string, content: string) {
    let chatRoom = await this.prisma.chatRoom.findUnique({
      where: { liveSessionId },
    });

    if (!chatRoom) {
      chatRoom = await this.prisma.chatRoom.create({ data: { liveSessionId } });
    }

    return this.prisma.message.create({
      data: {
        chatRoomId: chatRoom.id,
        userId,
        content,
      },
    });
  }

  async getMessages(liveSessionId: string, viewerId?: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { liveSessionId },
    });

    if (!chatRoom) throw new NotFoundException('Chat room not found');

    let blockedIds: string[] = [];
    if (viewerId) {
      const blocks = await this.prisma.blocklist.findMany({
        where: {
          OR: [
            { userId: viewerId },
            { blockedUserId: viewerId },
          ],
        },
        select: { userId: true, blockedUserId: true },
      });
      blockedIds = blocks
        .map((b) => (b.userId === viewerId ? b.blockedUserId : b.userId))
        .filter(Boolean);
    }

    return this.prisma.message.findMany({
      where: {
        chatRoomId: chatRoom.id,
        ...(blockedIds.length > 0 ? { NOT: { userId: { in: blockedIds } } } : {}),
      },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
  }
}
