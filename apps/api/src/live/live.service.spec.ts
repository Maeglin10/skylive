import { LiveService } from './live.service';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { NotificationsGateway } from '../events/notifications.gateway';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('LiveService', () => {
  let service: LiveService;
  let prisma: jest.Mocked<PrismaService>;
  let notifications: NotificationsGateway;

  beforeEach(() => {
    prisma = {
      creator: {
        findUnique: jest.fn(),
      },
      liveSession: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      subscription: {
        findFirst: jest.fn(),
      },
      purchase: {
        findFirst: jest.fn(),
      },
      blocklist: {
        findFirst: jest.fn(),
      },
    } as any;

    notifications = { notifyUser: jest.fn() } as unknown as NotificationsGateway;
    const jobs = { trackEvent: jest.fn() } as unknown as JobsService;
    service = new LiveService(prisma, jobs, notifications);
  });

  describe('createSession', () => {
    it('creates a session with status OFFLINE', async () => {
      prisma.creator.findUnique.mockResolvedValue({ id: 'creator-1' } as any);
      prisma.liveSession.create.mockResolvedValue({
        id: 'session-1',
        creatorId: 'creator-1',
        title: 'My Live',
        status: 'OFFLINE',
        accessRule: 'FREE',
      } as any);

      const result = await service.createSession('user-1', {
        title: 'My Live',
        accessRule: 'FREE',
      } as any);

      expect(result.id).toBe('session-1');
      expect(result.status).toBe('OFFLINE');
      expect(prisma.liveSession.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            creatorId: 'creator-1',
            title: 'My Live',
            status: 'OFFLINE',
            accessRule: 'FREE',
          }),
        }),
      );
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

  describe('startSession', () => {
    it('passes session to LIVE status', async () => {
      prisma.creator.findUnique.mockResolvedValue({ id: 'creator-1' } as any);
      prisma.liveSession.findUnique.mockResolvedValue({
        id: 'session-1',
        creatorId: 'creator-1',
        streamKey: 'key-123',
      } as any);
      prisma.liveSession.update.mockResolvedValue({
        id: 'session-1',
        creatorId: 'creator-1',
        status: 'LIVE',
        title: 'My Live',
        streamKey: 'key-123',
      } as any);

      const result = await service.startSession('user-1', 'session-1');

      expect(result.status).toBe('LIVE');
      expect(prisma.liveSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'LIVE' }),
        }),
      );
      expect(notifications.notifyUser).toHaveBeenCalled();
    });

    it('throws ForbiddenException if not the owner', async () => {
      prisma.creator.findUnique.mockResolvedValue({ id: 'creator-1' } as any);
      prisma.liveSession.findUnique.mockResolvedValue({
        id: 'session-1',
        creatorId: 'creator-2',
      } as any);

      await expect(
        service.startSession('user-1', 'session-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException if session not found', async () => {
      prisma.creator.findUnique.mockResolvedValue({ id: 'creator-1' } as any);
      prisma.liveSession.findUnique.mockResolvedValue(null);

      await expect(
        service.startSession('user-1', 'session-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('endSession', () => {
    it('passes session to ENDED status', async () => {
      prisma.creator.findUnique.mockResolvedValue({ id: 'creator-1' } as any);
      prisma.liveSession.findUnique.mockResolvedValue({
        id: 'session-1',
        creatorId: 'creator-1',
      } as any);
      prisma.liveSession.update.mockResolvedValue({
        id: 'session-1',
        creatorId: 'creator-1',
        status: 'ENDED',
      } as any);

      const result = await service.endSession('user-1', 'session-1');

      expect(result.status).toBe('ENDED');
      expect(prisma.liveSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'ENDED' }),
        }),
      );
    });
  });

  describe('listSessions', () => {
    it('lists all sessions without status filter', async () => {
      prisma.liveSession.findMany.mockResolvedValue([
        { id: 'session-1', status: 'LIVE' } as any,
        { id: 'session-2', status: 'OFFLINE' } as any,
      ]);

      const result = await service.listSessions();

      expect(result).toHaveLength(2);
      expect(prisma.liveSession.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: undefined }),
      );
    });

    it('lists sessions filtered by status', async () => {
      prisma.liveSession.findMany.mockResolvedValue([
        { id: 'session-1', status: 'LIVE' } as any,
      ]);

      await service.listSessions('LIVE');

      expect(prisma.liveSession.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'LIVE' } }),
      );
    });
  });
});
