import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleDestroy } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { LiveService } from '../live/live.service';
import { ChatService } from './chat.service';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from 'redis';

interface ChatJoinPayload {
  liveSessionId: string;
}

interface ChatMessagePayload {
  liveSessionId: string;
  content: string;
}

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
  @WebSocketServer()
  server!: Server;

  private readonly viewers = new Map<string, Set<string>>();
  private readonly logger = new Logger(ChatGateway.name);
  private pubClient?: RedisClientType;
  private subClient?: RedisClientType;

  constructor(
    private readonly jwtService: JwtService,
    private readonly liveService: LiveService,
    private readonly chatService: ChatService,
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
      this.logger.log('Socket.IO Redis adapter enabled');
    } catch (error) {
      this.logger.error(
        `Failed to init Socket.IO Redis adapter: ${error instanceof Error ? error.message : String(error)}`,
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
      client.data.userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    for (const [roomId, sockets] of this.viewers.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        this.emitViewerCount(roomId);
      }
    }
  }

  async onModuleDestroy() {
    await this.subClient?.quit().catch(() => undefined);
    await this.pubClient?.quit().catch(() => undefined);
  }

  @SubscribeMessage('chat:join')
  async onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatJoinPayload,
  ) {
    const userId = client.data.userId as string | undefined;
    if (!userId) return;

    await this.liveService.assertLiveAccess(userId, payload.liveSessionId);

    await client.join(payload.liveSessionId);
    if (!this.viewers.has(payload.liveSessionId)) {
      this.viewers.set(payload.liveSessionId, new Set());
    }
    this.viewers.get(payload.liveSessionId)!.add(client.id);
    this.emitViewerCount(payload.liveSessionId);

    const messages = await this.chatService.getMessages(payload.liveSessionId).catch(() => []);
    client.emit('chat:history', messages);
  }

  @SubscribeMessage('chat:leave')
  async onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatJoinPayload,
  ) {
    await client.leave(payload.liveSessionId);
    const set = this.viewers.get(payload.liveSessionId);
    if (set) {
      set.delete(client.id);
      this.emitViewerCount(payload.liveSessionId);
    }
  }

  @SubscribeMessage('chat:message')
  async onMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatMessagePayload,
  ) {
    const userId = client.data.userId as string | undefined;
    if (!userId) return;

    await this.liveService.assertLiveAccess(userId, payload.liveSessionId);

    const message = await this.chatService.saveMessage(
      payload.liveSessionId,
      userId,
      payload.content,
    );

    this.server.to(payload.liveSessionId).emit('chat:message', message);
  }

  private emitViewerCount(liveSessionId: string) {
    const count = this.viewers.get(liveSessionId)?.size ?? 0;
    this.server.to(liveSessionId).emit('chat:viewer_count', { liveSessionId, count });
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
