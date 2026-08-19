import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import type { Notification } from '../../api/notifications';
import { linkFor, metaFor } from './notfications.helpers';

/**
 * Popup notifikasi masuk. Sebelumnya notifikasi hanya menambah angka di lonceng,
 * jadi user yang sedang membaca halaman lain tidak pernah sadar ada yang masuk.
 *
 * Ditumpuk maksimal tiga: lebih dari itu popup menutupi isi halaman, dan yang
 * lama toh sudah tercatat di lonceng.
 */

const AUTO_DISMISS_MS = 6000;
const MAX_VISIBLE = 3;

const NotificationToaster: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<Notification[]>([]);
  const timers = useRef<Record<string, number>>({});
  // Notifikasi yang sudah pernah tampil tidak boleh tampil lagi. React
  // StrictMode menjalankan efek dua kali di mode pengembangan, sehingga socket
  // terbuka dobel dan popup yang sama muncul dua kali.
  const sudahTampil = useRef<Set<string>>(new Set());

  const dismiss = useCallback((id: string) => {
    setQueue((current) => current.filter((n) => n.id !== id));
    const timer = timers.current[id];
    if (timer) {
      window.clearTimeout(timer);
      delete timers.current[id];
    }
  }, []);

  useNotificationSocket((payload) => {
    if (payload.event !== 'notification') return;
    const incoming = payload.data;
    if (sudahTampil.current.has(incoming.id)) return;
    sudahTampil.current.add(incoming.id);
    setQueue((current) => [incoming, ...current].slice(0, MAX_VISIBLE));
  });

  useEffect(() => {
    for (const item of queue) {
      if (timers.current[item.id]) continue;
      timers.current[item.id] = window.setTimeout(() => dismiss(item.id), AUTO_DISMISS_MS);
    }
  }, [queue, dismiss]);

  // Bersihkan timer saat komponen dilepas supaya tidak menyentuh state yatim.
  useEffect(
    () => () => {
      Object.values(timers.current).forEach(window.clearTimeout);
      timers.current = {};
    },
    []
  );

  if (!isAuthenticated || queue.length === 0) return null;

  const open = (notification: Notification) => {
    const link = linkFor(notification, user?.role);
    dismiss(notification.id);
    if (link) navigate(link);
  };

  return (
    <div
      // Diumumkan sopan, bukan assertive: notifikasi ini informasi, bukan
      // peringatan yang harus memotong apa pun yang sedang dibaca.
      role="status"
      aria-live="polite"
      className="
        pointer-events-none fixed inset-x-3 top-3 z-[100] flex flex-col gap-2
        sm:inset-x-auto sm:right-5 sm:top-20 sm:w-[360px]
      "
    >
      {queue.map((notification) => {
        const meta = metaFor(notification);
        return (
          <div
            key={notification.id}
            className="
              pointer-events-auto flex items-start gap-3 rounded-2xl border
              border-[#e0e3e5] bg-white p-3 shadow-[0_10px_30px_rgba(16,19,25,0.12)]
              motion-safe:animate-slideDown
            "
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.text}`}
            >
              <Icon name={meta.icon} size={17} />
            </span>

            <button
              type="button"
              onClick={() => open(notification)}
              className="
                min-w-0 flex-1 text-left focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-[#4077a6]
              "
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#737686]">
                {meta.label}
              </p>
              <p className="truncate text-[13px] font-bold text-[#101319]">{notification.title}</p>
              <p className="line-clamp-2 text-[12px] text-[#434655]">{notification.message}</p>
            </button>

            <button
              type="button"
              onClick={() => dismiss(notification.id)}
              aria-label="Tutup notifikasi"
              className="
                shrink-0 rounded-full p-1 text-[#737686] transition-colors
                hover:bg-[#f2f4f6] hover:text-[#101319] focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-[#4077a6]
              "
            >
              <Icon name="close" size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToaster;
