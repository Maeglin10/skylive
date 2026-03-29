import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InvalidRefreshTokenError } from '../common/errors/known-error';
import { JobsService } from '../jobs/jobs.service';
import { GoogleProfile } from './strategies/google.strategy';
import { EmailService } from '../email/email.service';

const BCRYPT_SALT_ROUNDS = 12;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly jobsService: JobsService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName ?? null,
      },
      select: { id: true, email: true, displayName: true, role: true },
    });

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.jobsService.trackEvent('auth.register', { userId: user.id });
    return { ...tokens, user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const activeBan = await this.prisma.ban.findFirst({
      where: {
        userId: user.id,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });
    if (activeBan) {
      throw new UnauthorizedException('User banned');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.jobsService.trackEvent('auth.login', { userId: user.id });
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token required');
    }

    const tokenRow = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRow || tokenRow.expiresAt < new Date()) {
      throw new InvalidRefreshTokenError();
    }

    const activeBan = await this.prisma.ban.findFirst({
      where: {
        userId: tokenRow.user.id,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });
    if (activeBan) {
      throw new UnauthorizedException('User banned');
    }

    await this.prisma.refreshToken.delete({ where: { token: refreshToken } });

    const tokens = await this.issueTokens(
      tokenRow.user.id,
      tokenRow.user.email,
      tokenRow.user.role,
    );

    return {
      ...tokens,
      user: {
        id: tokenRow.user.id,
        email: tokenRow.user.email,
        displayName: tokenRow.user.displayName,
        role: tokenRow.user.role,
      },
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return { success: true };
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { success: true };
  }

  async requestMagicLink(email: string) {
    const token = randomBytes(48).toString('hex');
    const ttlMinutes = Number(process.env.MAGIC_LINK_TTL_MINUTES || 15);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await this.prisma.magicLink.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    const magicLinkBaseUrl = `${this.configService.get('FRONTEND_URL')}/auth/magic/verify`;
    await this.emailService.sendMagicLink(email, token, magicLinkBaseUrl);

    return {
      success: true,
      ...(process.env.NODE_ENV !== 'production' ? { token } : {}),
    };
  }

  async verifyMagicLink(token: string) {
    const link = await this.prisma.magicLink.findUnique({ where: { token } });
    if (!link || link.expiresAt < new Date() || link.usedAt) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: link.email } });
    if (existing) {
      const activeBan = await this.prisma.ban.findFirst({
        where: {
          userId: existing.id,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });
      if (activeBan) {
        throw new UnauthorizedException('User banned');
      }
    }

    await this.prisma.magicLink.update({
      where: { token },
      data: { usedAt: new Date() },
    });

    let user = existing;
    if (!user) {
      const randomPassword = randomBytes(48).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, BCRYPT_SALT_ROUNDS);
      user = await this.prisma.user.create({
        data: {
          email: link.email,
          passwordHash,
          displayName: null,
        },
      });
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.jobsService.trackEvent('auth.magic', { userId: user.id });

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }

  async loginWithGoogle(profile: GoogleProfile) {
    let user = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email: profile.email } });
    }

    if (!user) {
      const randomPassword = randomBytes(48).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, BCRYPT_SALT_ROUNDS);
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          googleId: profile.googleId,
          passwordHash,
          displayName: profile.displayName ?? null,
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.googleId },
      });
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.jobsService.trackEvent('auth.google', { userId: user.id });

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }

  private async issueTokens(userId: string, email: string, role: string): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role },
      { expiresIn: process.env.JWT_EXPIRATION || '12h' },
    );

    const refreshToken = randomBytes(48).toString('hex');
    const refreshExpiresAt = new Date(Date.now() + this.parseDurationMs());

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: refreshExpiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  private parseDurationMs() {
    const raw = process.env.JWT_REFRESH_EXPIRATION || '7d';
    const match = raw.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }
    const value = Number(match[1]);
    const unit = match[2];
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
      default:
        return value * 24 * 60 * 60 * 1000;
    }
  }
}
