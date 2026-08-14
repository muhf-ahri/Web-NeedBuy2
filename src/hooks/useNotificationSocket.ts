import { useEffect, useRef } from 'react';
import { notificationSocketUrl, type NotificationSocketEvent } from '../api/notifications';

/** Jeda sambung ulang WebSocket, naik berlipat sampai batas atas. */
const RECONNECT_MIN_MS = 3000;
const RECONNECT_MAX_MS = 60_000;

/**
 * Menutup socket dengan aman.
 *
 * `close()` pada socket yang masih CONNECTING membuat browser mengeluh
 * "WebSocket is closed before the connection is established" — kondisi yang
 * rutin terjadi karena StrictMode memasang lalu melepas effect dua kali saat
 * dev. Penutupannya ditunda sampai koneksinya benar-benar terbuka.
 */
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

/**
 * Satu langganan `/ws/notifications` per komponen yang butuh. Dipakai bel di
 * header dan halaman notifikasi admin — logikanya cuma ada di sini supaya
 * perbaikan reconnect nggak perlu dikerjakan dua kali.
 *
 * `onEvent` disimpan di ref: handler yang di-inline pemanggil berganti tiap
 * render, dan kalau itu masuk dependency effect, socket-nya bakal disambung
 * ulang tiap render.
 */
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
      // Backoff: token yang sudah mati tidak akan hidup lagi dalam 5 detik.
      // Tanpa ini, satu tab yang tokennya kedaluwarsa menghantam server tiap
      // 5 detik tanpa henti dan membanjiri konsol.
      delay = Math.min(delay * 2, RECONNECT_MAX_MS);
    };

    function connect() {
      if (stopped) return;

      // Dibaca ULANG tiap percobaan, bukan sekali di luar. Access token hanya
      // berumur 15 menit dan diganti diam-diam oleh interceptor di
      // api/client.ts; kalau nilainya dibekukan di closure, socket akan
      // selamanya memakai token mati dan tidak pernah pulih sendiri.
      const token = localStorage.getItem('token');
      if (!token) {
        scheduleRetry();
        return;
      }

      socket = new WebSocket(notificationSocketUrl(token));

      socket.onopen = () => {
        delay = RECONNECT_MIN_MS;
      };

      socket.onmessage = (event) => {
        handler.current(JSON.parse(event.data) as NotificationSocketEvent);
      };

      // Socket putus (tunnel restart, laptop sleep, token diganti) tidak boleh
      // mematikan aliran notifikasi sampai halaman di-reload.
      socket.onclose = scheduleRetry;
    }

    // Sesi benar-benar habis: berhenti, jangan menyambung ulang dengan token
    // yang sudah dicabut. Event ini dikirim api/client.ts saat refresh gagal.
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
