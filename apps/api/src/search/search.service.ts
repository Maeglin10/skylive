import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(q: string, type: 'all' | 'creators' | 'content' = 'all') {
    // Validate query length
    if (!q || q.trim().length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }

    const query = q.trim();
    const results: { creators?: any[]; content?: any[] } = {};

    if (type === 'creators' || type === 'all') {
      results.creators = await this.searchCreators(query);
    }

    if (type === 'content' || type === 'all') {
      results.content = await this.searchContent(query);
    }

    return results;
  }

  private async searchCreators(q: string) {
    return this.prisma.creator.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { user: { displayName: { contains: q, mode: 'insensitive' } } },
        ],
      },
      select: {
        id: true,
        username: true,
        user: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      take: 20,
    });
  }

  private async searchContent(q: string) {
    const results = await this.prisma.content.findMany({
      where: {
        AND: [
          {
            OR: [
              { text: { contains: q, mode: 'insensitive' } },
              { mediaKey: { contains: q, mode: 'insensitive' } },
            ],
          },
          { isHidden: false },
        ],
      },
      select: {
        id: true,
        type: true,
        accessRule: true,
        mediaKey: true,
        text: true,
        creator: {
          select: {
            username: true,
          },
        },
      },
      take: 20,
    });

    // Map to response format
    return results.map((item) => ({
      id: item.id,
      type: item.type,
      accessRule: item.accessRule,
      thumbnailUrl: item.mediaKey ?? null,
      creatorName: item.creator.username,
    }));
  }
}
