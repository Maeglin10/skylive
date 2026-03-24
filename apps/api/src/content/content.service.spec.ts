import { ContentService } from './content.service';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';

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
      },
      liveSession: {
        findMany: jest.fn(),
      },
      blocklist: {
        findMany: jest.fn(),
      },
      subscription: {
        findFirst: jest.fn(),
      },
      purchase: {
        findFirst: jest.fn(),
      },
    } as any;

    const jobs = { trackEvent: jest.fn() } as unknown as JobsService;
    service = new ContentService(prisma, jobs);
  });

  it('creates content with defaults', async () => {
    prisma.creator.findUnique.mockResolvedValue({ id: 'creator-1' } as any);
    prisma.content.create.mockResolvedValue({
      id: 'content-1',
      accessRule: 'FREE',
      type: 'POST',
    } as any);

    const result = await service.create('user-1', { type: 'POST' } as any);

    expect(result.id).toBe('content-1');
    expect(prisma.content.create).toHaveBeenCalled();
  });

  it('filters hidden content for non-admin feed', async () => {
    prisma.content.findMany.mockResolvedValue([]);
    prisma.liveSession.findMany.mockResolvedValue([]);

    await service.getFeed(null, { page: 1, limit: 20 });

    expect(prisma.content.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isHidden: false } }),
    );
  });
});
