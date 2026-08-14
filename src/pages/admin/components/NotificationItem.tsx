// src/pages/admin/components/NotificationItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/ui/Icon';
import type { Notification } from '../data/notificationsData';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

const categoryColor: Record<Notification['category'], string> = {
  System: 'border-[#cfe8ff] bg-[#f0f7ff]',
  Orders: 'border-[#d7f5dc] bg-[#f0faf2]',
  Payments: 'border-[#fff4e0] bg-[#fffbee]',
  Reports: 'border-[#ffe0e0] bg-[#fff5f5]',
};

const categoryLabel: Record<Notification['category'], string> = {
  System: 'Sistem',
  Orders: 'Pesanan',
  Payments: 'Pembayaran',
  Reports: 'Laporan',
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
}) => {
  const isUnread = notification.status === 'unread';

  return (
    <div
      className={`rounded-xl border-l-4 p-4 transition-colors ${
        isUnread ? 'bg-white' : 'bg-[#f8f9fb] opacity-80'
      } ${categoryColor[notification.category]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isUnread
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-[#e0e3e5] text-[#737686]'
              }`}
            >
              {isUnread ? 'Baru' : 'Dibaca'}
            </span>
            <span className="text-[11px] font-medium text-[#737686]">
              {categoryLabel[notification.category]}
            </span>
            <span className="text-[11px] text-[#737686]">
              {formatDate(notification.createdAt)}
            </span>
          </div>

          <h3 className="mt-1.5 text-[15px] font-bold text-[#191c1e]">
            {notification.title}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-[#434655]">
            {notification.message}
          </p>

          {notification.actionLabel && notification.actionLink && (
            <Link
              to={notification.actionLink}
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#004ac6] hover:underline"
            >
              {notification.actionLabel}
              <Icon name="arrowRight" size={14} />
            </Link>
          )}
        </div>

        {isUnread && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="shrink-0 rounded-lg p-2 text-[#737686] transition-colors hover:bg-[#f2f4f6] hover:text-[#004ac6]"
            aria-label="Tandai sudah dibaca"
          >
            <Icon name="check" size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;