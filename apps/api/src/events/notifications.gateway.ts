import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleDestroy } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from 'redis';

export interface NotificationEvent {
  type: 'new_subscriber' | 'new_tip' | 'live_started';
  message: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

@WebSocketGateway({ namespace: '/notifications', cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private pubClient?: RedisClientType;
  private subClient?: RedisClientType;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async afterInit(server: Server) {
    const redisUrl = this.getRedisUrl();
    if (!redisUrl) {
      this.logger.warn('Redis adapter disabled: no REDIS_URL/REDIS_HOST/REDIS_PORT configured');
      return;
    }

    try {
      this.pubClient = createClient({ url: redisUrl });
      this.subClient = this.pubClient.duplicate();

      await this.pubClient.connect();
      await this.subClient.connect();

      server.adapter(createAdapter(this.pubClient, this.subClient));
      this.logger.log('Socket.IO Redis adapter enabled for notifications');
    } catch (error) {
      this.logger.error(
        `Failed to init Socket.IO Redis adapter for notifications: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async handleConnection(client: Socket) {
    const token =
      client.handshake.auth?.token ||
      (typeof client.handshake.headers.authorization === 'string'
        ? client.handshake.headers.authorization.replace('Bearer ', '')
        : null);

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<{ sub: string }>(token, {
        secret: process.env.JWT_SECRET || 'dev_secret',
      });
      const activeBan = await this.prisma.ban.findFirst({
        where: {
          userId: payload.sub,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });
      if (activeBan) {
        client.disconnect();
        return;
      }
      client.data.userId = payload.sub;
      await client.join(`user:${payload.sub}`);
      this.logger.debug(`Client ${client.id} connected for user ${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug(`Client ${client.id} disconnected`);
  }

  async onModuleDestroy() {
    await this.subClient?.quit().catch(() => undefined);
    await this.pubClient?.quit().catch(() => undefined);
  }

  notifyUser(userId: string, event: NotificationEvent): void {
    this.server.to(`user:${userId}`).emit('notification', event);
  }

  private getRedisUrl() {
    if (process.env.REDIS_URL) return process.env.REDIS_URL;

    const host = process.env.REDIS_HOST;
    const port = process.env.REDIS_PORT;
    if (!host && !port) return null;

    const resolvedHost = host || 'localhost';
    const resolvedPort = port || '6379';
    return `redis://${resolvedHost}:${resolvedPort}`;
  }
}
