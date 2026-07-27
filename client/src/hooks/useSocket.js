import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socketInstance = null;

export function getSocket() {
  return socketInstance;
}

export function useSocket() {
  const { user, accessToken, isAuthenticated } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !accessToken || initialized.current) return;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

    socketInstance = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('🔌 Socket connected');
      if (user?.id) socketInstance.emit('join:user', user.id);
      if (user?.role) socketInstance.emit('join:role', user.role);
      if (user?.societyId) socketInstance.emit('join:society', user.societyId);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    initialized.current = true;

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        initialized.current = false;
      }
    };
  }, [isAuthenticated, accessToken, user]);

  return socketInstance;
}
