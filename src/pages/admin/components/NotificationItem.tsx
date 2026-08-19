import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/ui/Icon';
import type { Notification, NotificationType } from '../../../api/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  pending?: boolean;
}

const typeColor: Record<NotificationType, string> = {
  ORDER_NEW: 'border-[#e6f4ee] bg-[#e6f4ee]',
  ORDER_STATUS: 'border-[#dbe1ff] bg-[#f5f7fb]',
  PAYMENT: 'border-[#fff7e0] bg-[#fff7e0]',
  LOW_STOCK: 'border-[#fff0f0] bg-[#fff0f0]',
  REVIEW: 'border-[#dbe1ff] bg-[#f5f7fb]',
};

export const typeLabel: Record<NotificationType, string> = {
  ORDER_NEW: 'Pesanan Baru',
  ORDER_STATUS: 'Status Pesanan',
  PAYMENT: 'Pembayaran',
  LOW_STOCK: 'Stok Menipis',
  REVIEW: 'Ulasan',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  pending = false,
}) => {
  const isUnread = !notification.read;

  return (
    <div
      className={`rounded-xl border-l-4 p-4 transition-colors ${
        isUnread ? 'bg-white' : 'bg-[#f5f7fb] opacity-80'
      } ${typeColor[notification.type]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isUnread ? 'bg-[#004ac6] text-white' : 'bg-[#e0e3e5] text-[#737686]'
              }`}
            >
              {isUnread ? 'Baru' : 'Dibaca'}
            </span>
            <span className="text-[11px] font-medium text-[#737686]">
              {typeLabel[notification.type]}
            </span>
            <span className="text-[11px] text-[#737686]">
              {formatDate(notification.createdAt)}
            </span>
          </div>

          <h3 className="mt-1.5 text-[15px] font-bold text-[#101319]">{notification.title}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-[#434655]">{notification.message}</p>

          {notification.order && (
            <Link
              to="/admin/orders"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#004ac6] hover:underline"
            >
              Lihat pesanan {notification.order.orderNumber}
              <Icon name="arrowRight" size={14} />
            </Link>
          )}
        </div>

        {isUnread && (
          <button
            onClick={() => onMarkRead(notification.id)}
            disabled={pending}
            className="shrink-0 rounded-lg p-2 text-[#737686] transition-colors hover:bg-[#f2f4f6] hover:text-[#004ac6] disabled:opacity-40"
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
