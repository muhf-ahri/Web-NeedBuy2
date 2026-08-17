import { useEffect, useRef } from 'react';
import { notificationSocketUrl, type NotificationSocketEvent } from '../api/notifications';

const RECONNECT_MIN_MS = 3000;
const RECONNECT_MAX_MS = 60_000;

function closeSocket(socket: WebSocket | null) {
  if (!socket) return;
  if (socket.readyState === WebSocket.CONNECTING) {
    socket.onopen = () => socket.close();
    socket.onclose = null;
    return;
  }
  socket.onclose = null;
  socket.close();
}

export function useNotificationSocket(onEvent: (event: NotificationSocketEvent) => void) {
  const handler = useRef(onEvent);
  handler.current = onEvent;

  useEffect(() => {
    let socket: WebSocket | null = null;
    let retryTimer: number | undefined;
    let stopped = false;
    let delay = RECONNECT_MIN_MS;

    const scheduleRetry = () => {
      if (stopped) return;
      retryTimer = window.setTimeout(connect, delay);
      
      delay = Math.min(delay * 2, RECONNECT_MAX_MS);
    };

    function connect() {
      if (stopped) return;

      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      socket = new WebSocket(notificationSocketUrl(token));

      socket.onopen = () => {
        delay = RECONNECT_MIN_MS;
      };

      socket.onmessage = (event) => {
        handler.current(JSON.parse(event.data) as NotificationSocketEvent);
      };

      socket.onclose = scheduleRetry;
    }

    const onExpired = () => {
      stopped = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      closeSocket(socket);
    };
    window.addEventListener('auth:expired', onExpired);

    connect();

    return () => {
      stopped = true;
      window.removeEventListener('auth:expired', onExpired);
      if (retryTimer) window.clearTimeout(retryTimer);
      closeSocket(socket);
    };
  }, []);
}
