import { ContentService } from './content.service';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ContentService', () => {
  let service: ContentService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      creator: {
        findUnique: jest.fn(),
      },
      content: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      liveSession: {
        findMany: jest.fn(),
      },
      blocklist: {
        findMany: jest.fn(),
      },
      subscription: {
        findMany: jest.fn(),
      },
      purchase: {
        findMany: jest.fn(),
      },
    } as any;

    const jobs = { trackEvent: jest.fn() } as unknown as JobsService;
    service = new ContentService(prisma, jobs);
  });

  describe('create', () => {
    it('creates content with defaults', async () => {
      prisma.creator.findUnique.mockResolvedValue({ id: 'creator-1' } as any);
      prisma.content.create.mockResolvedValue({
        id: 'content-1',
        accessRule: 'FREE',
        type: 'POST',
        creatorId: 'creator-1',
      } as any);

      const result = await service.create('user-1', { type: 'POST' } as any);

      expect(result.id).toBe('content-1');
      expect(prisma.content.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            creatorId: 'creator-1',
            type: 'POST',
            accessRule: 'FREE',
          }),
        }),
      );
    });
  });

  describe('getById', () => {
    it('throws NotFoundException if content not found', async () => {
      prisma.content.findUnique.mockResolvedValue(null);

      await expect(service.getById(null, 'content-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns content with access context for FREE rule', async () => {
      prisma.content.findUnique.mockResolvedValue({
        id: 'content-1',
        accessRule: 'FREE',
        creatorId: 'creator-1',
        creator: { userId: 'user-2' },
      } as any);
      prisma.subscription.findMany.mockResolvedValue([]);
      prisma.purchase.findMany.mockResolvedValue([]);

      const result = await service.getById(
        { id: 'user-1', role: 'VIEWER' },
        'content-1',
      );

      expect(result.id).toBe('content-1');
      expect(result.accessRule).toBe('FREE');
    });

    it('throws ForbiddenException if hidden content and not admin/owner', async () => {
      prisma.content.findUnique.mockResolvedValue({
        id: 'content-1',
        isHidden: true,
        creatorId: 'creator-1',
        creator: { userId: 'user-2' },
      } as any);

      await expect(
        service.getById({ id: 'user-1', role: 'VIEWER' }, 'content-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFeed', () => {
    it('filters hidden content for non-admin feed', async () => {
      prisma.content.findMany.mockResolvedValue([]);
      prisma.liveSession.findMany.mockResolvedValue([]);
      prisma.blocklist.findMany.mockResolvedValue([]);

      await service.getFeed(null, { page: 1, limit: 20 });

      expect(prisma.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isHidden: false } }),
      );
    });

    it('returns content and live sessions with pagination', async () => {
      const mockContent = [
        {
          id: 'content-1',
          creatorId: 'creator-1',
          accessRule: 'FREE',
          creator: {
            userId: 'user-2',
            user: { displayName: 'Creator', avatarUrl: null },
          },
        },
      ];
      const mockLive = [
        {
          id: 'session-1',
          creatorId: 'creator-1',
          accessRule: 'FREE',
          creator: {
            userId: 'user-2',
            user: { displayName: 'Creator', avatarUrl: null },
          },
        },
      ];

      prisma.content.findMany.mockResolvedValue(mockContent as any);
      prisma.liveSession.findMany.mockResolvedValue(mockLive as any);
      prisma.blocklist.findMany.mockResolvedValue([]);
      prisma.subscription.findMany.mockResolvedValue([]);
      prisma.purchase.findMany.mockResolvedValue([]);

      const result = await service.getFeed(null, { page: 1, limit: 20 });

      expect(result.pagination).toEqual({ page: 1, limit: 20 });
      expect(result.content).toHaveLength(1);
      expect(result.liveSessions).toHaveLength(1);
    });

    it('filters hidden content only for admin', async () => {
      prisma.content.findMany.mockResolvedValue([]);
      prisma.liveSession.findMany.mockResolvedValue([]);
      prisma.blocklist.findMany.mockResolvedValue([]);
      prisma.creator.findUnique.mockResolvedValue({ id: 'creator-1' } as any);
      prisma.subscription.findMany.mockResolvedValue([]);
      prisma.purchase.findMany.mockResolvedValue([]);

      await service.getFeed({ id: 'admin-1', role: 'ADMIN' }, { page: 1, limit: 20 });

      expect(prisma.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: undefined }),
      );
    });
  });
});
