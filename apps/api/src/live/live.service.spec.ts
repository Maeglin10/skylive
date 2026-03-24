import { LiveService } from './live.service';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';

describe('LiveService', () => {
  let service: LiveService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      creator: {
        findUnique: jest.fn(),
      },
      liveSession: {
        create: jest.fn(),
      },
    } as any;

    const jobs = { trackEvent: jest.fn() } as unknown as JobsService;
    service = new LiveService(prisma, jobs);
  });

  it('rejects PPV live sessions without a price', async () => {
    prisma.creator.findUnique.mockResolvedValue({ id: 'creator-1' } as any);

    await expect(
      service.createSession('user-1', {
        title: 'PPV Live',
        accessRule: 'PPV',
      } as any),
    ).rejects.toThrow('PPV live sessions require a price');
  });
});
