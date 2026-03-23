import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { LiveService } from '../live/live.service';
import { ChatService } from './chat.service';

interface ChatJoinPayload {
  liveSessionId: string;
}

interface ChatMessagePayload {
  liveSessionId: string;
  content: string;
}

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly viewers = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly liveService: LiveService,
    private readonly chatService: ChatService,
  ) {}

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
}
