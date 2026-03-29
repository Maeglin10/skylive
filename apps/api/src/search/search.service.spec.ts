import { SearchService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('SearchService', () => {
  let service: SearchService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      creator: {
        findMany: jest.fn(),
      },
      content: {
        findMany: jest.fn(),
      },
    } as any;

    service = new SearchService(prisma);
  });

  describe('search', () => {
    it('throws BadRequestException if query less than 2 characters', async () => {
      await expect(service.search('a', 'all')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException if query is empty', async () => {
      await expect(service.search('', 'all')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('returns creators array when type is "creators"', async () => {
      prisma.creator.findMany.mockResolvedValue([
        {
          id: 'creator-1',
          username: 'testcreator',
          user: { displayName: 'Test Creator', avatarUrl: null },
        } as any,
      ]);

      const result = await service.search('test', 'creators');

      expect(result.creators).toHaveLength(1);
      expect(result.creators[0].username).toBe('testcreator');
      expect(result.content).toBeUndefined();
    });

    it('returns content array when type is "content"', async () => {
      prisma.content.findMany.mockResolvedValue([
        {
          id: 'content-1',
          type: 'POST',
          accessRule: 'FREE',
          mediaKey: 'test-key',
          text: 'test content',
          creator: { username: 'testcreator' },
        } as any,
      ]);

      const result = await service.search('test', 'content');

      expect(result.content).toHaveLength(1);
      expect(result.content[0].id).toBe('content-1');
      expect(result.creators).toBeUndefined();
    });

    it('returns both creators and content when type is "all"', async () => {
      prisma.creator.findMany.mockResolvedValue([
        {
          id: 'creator-1',
          username: 'testcreator',
          user: { displayName: 'Test Creator', avatarUrl: null },
        } as any,
      ]);

      prisma.content.findMany.mockResolvedValue([
        {
          id: 'content-1',
          type: 'POST',
          accessRule: 'FREE',
          mediaKey: 'test-key',
          text: 'test content',
          creator: { username: 'testcreator' },
        } as any,
      ]);

      const result = await service.search('test', 'all');

      expect(result.creators).toHaveLength(1);
      expect(result.content).toHaveLength(1);
    });

    it('maps content response format correctly', async () => {
      prisma.content.findMany.mockResolvedValue([
        {
          id: 'content-1',
          type: 'VIDEO',
          accessRule: 'PPV',
          mediaKey: 'media-123',
          text: 'test',
          creator: { username: 'creator1' },
        } as any,
      ]);

      const result = await service.search('test', 'content');

      expect(result.content[0]).toEqual({
        id: 'content-1',
        type: 'VIDEO',
        accessRule: 'PPV',
        thumbnailUrl: 'media-123',
        creatorName: 'creator1',
      });
    });

    it('filters hidden content from search results', async () => {
      prisma.content.findMany.mockResolvedValue([]);

      await service.search('test', 'content');

      expect(prisma.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({ isHidden: false }),
            ]),
          }),
        }),
      );
    });

    it('trims and normalizes search query', async () => {
      prisma.creator.findMany.mockResolvedValue([]);

      await service.search('  test  ', 'creators');

      expect(prisma.creator.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                username: { contains: 'test', mode: 'insensitive' },
              }),
            ]),
          }),
        }),
      );
    });
  });
});
