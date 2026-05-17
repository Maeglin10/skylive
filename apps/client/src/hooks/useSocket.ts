'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useSocket() {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('access_token'),
      },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to AeviaLive WebSocket Signal');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from Signal');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const emit = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
  };

  return { isConnected, emit, on };
}
