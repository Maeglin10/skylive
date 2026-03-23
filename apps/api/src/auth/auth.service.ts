import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InvalidRefreshTokenError } from '../common/errors/known-error';

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
    return { ...tokens, user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role);
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
