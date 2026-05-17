'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  userId: string;
  displayName: string;
  content: string;
  createdAt: string;
}

export function useChat(liveSessionId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    if (!liveSessionId) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      if (typeof window !== 'undefined') {
        console.warn('[useChat] NEXT_PUBLIC_WS_URL is not set — chat disabled');
      }
      return;
    }

    const socket = io(`${wsUrl}/chat`, {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('access_token'),
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('chat:join', { liveSessionId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat:message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('chat:viewer_count', ({ count }: { count: number }) => {
      setViewerCount(count);
    });

    return () => {
      socket.emit('chat:leave', { liveSessionId });
      socket.disconnect();
    };
  }, [liveSessionId]);

  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('chat:message', { liveSessionId, content });
    }
  }, [liveSessionId, isConnected]);

  return {
    messages,
    sendMessage,
    isConnected,
    viewerCount,
  };
}
