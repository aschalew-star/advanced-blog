// src/hooks/use-socket.ts
'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react'; // assuming Auth.js
import { useNotificationStore } from './use-notifications.store';

const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
  path: '/api/socket.io',
});

export function useSocket() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    socket.emit('join-user-room', session.user.id);

    socket.on('notification', (data) => {
      useNotificationStore.getState().addNotification(data);
    });

    return () => {
      socket.off('notification');
    };
  }, [session?.user?.id]);

  return socket;
}