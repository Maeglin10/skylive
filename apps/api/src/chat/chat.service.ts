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

  async getMessages(liveSessionId: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { liveSessionId },
    });

    if (!chatRoom) throw new NotFoundException('Chat room not found');

    return this.prisma.message.findMany({
      where: { chatRoomId: chatRoom.id },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
  }
}
