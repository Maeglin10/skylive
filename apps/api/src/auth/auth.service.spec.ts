import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      ban: {
        findFirst: jest.fn(),
      },
      magicLink: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    } as any;

    const jwt = { sign: jest.fn().mockReturnValue('access-token') } as unknown as JwtService;
    const jobs = { trackEvent: jest.fn() } as unknown as JobsService;
    service = new AuthService(prisma, jwt, jobs);
  });

  it('registers a user and returns tokens', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      displayName: 'User',
      role: 'VIEWER',
    } as any);

    const result = await service.register({
      email: 'user@example.com',
      password: 'Password123!',
      displayName: 'User',
    });

    expect(result.user.email).toBe('user@example.com');
    expect(prisma.refreshToken.create).toHaveBeenCalled();
  });

  it('verifies a magic link and issues tokens', async () => {
    prisma.magicLink.findUnique.mockResolvedValue({
      email: 'magic@example.com',
      token: 'token',
      expiresAt: new Date(Date.now() + 10000),
      usedAt: null,
    } as any);
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-2',
      email: 'magic@example.com',
      displayName: null,
      role: 'VIEWER',
    } as any);

    const result = await service.verifyMagicLink('token');
    expect(result.user.email).toBe('magic@example.com');
    expect(prisma.magicLink.update).toHaveBeenCalled();
  });
});
