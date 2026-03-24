import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(type?: string, limit = 100) {
    return this.prisma.eventLog.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 500),
    });
  }
}
