import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../ui/Icon';
import type { Notification } from '../../api/notifications';
import { relativeTime, linkFor, metaFor } from './notfications.helpers';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onOpen?: () => void;
  /** Mode ringkas (dropdown) vs normal (halaman) */
  compact?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onOpen,
  compact = false,
}) => {
  const link = linkFor(notification);
  const isUnread = !notification.read;
  const meta = metaFor(notification);

  const handleClick = () => {
    onRead(notification.id);
    onOpen?.();
  };

  const body = (
    <div className={`flex items-start gap-3 ${compact ? '' : 'sm:gap-4'}`}>
      {/* Icon indicator */}
      <span
        className={`
          mt-0.5 flex shrink-0 items-center justify-center rounded-lg
          transition-colors
          ${isUnread ? `${meta.bg} ${meta.text}` : 'bg-[#F5F7FB] text-[#A2A8B3]'}
          ${compact ? 'h-8 w-8' : 'h-10 w-10 sm:h-11 sm:w-11'}
        `}
      >
        <Icon name={meta.icon} size={compact ? 15 : 18} />
      </span>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`
                  inline-flex items-center gap-1 rounded-full px-2 py-0.5
                  text-[9px] font-semibold uppercase tracking-wider
                  ${meta.bg} ${meta.text}
                `}
              >
                {meta.label}
              </span>
              {!compact && (
                <span className="text-[10px] text-[#A2A8B3]">
                  {relativeTime(notification.createdAt)}
                </span>
              )}
            </div>
            <p
              className={`
                mt-1 leading-snug
                ${compact ? 'text-[13px]' : 'text-[14px]'}
                ${isUnread ? 'font-semibold text-[#20242D]' : 'font-medium text-[#20242D]'}
              `}
            >
              {notification.title}
            </p>
          </div>

          {!compact && isUnread && (
            <span
              className="
                mt-2 h-2 w-2 shrink-0 rounded-full bg-[#538CDB]
                ring-4 ring-[#538CDB]/15
              "
            />
          )}
        </div>

        <p
          className={`
            mt-1 leading-relaxed text-[#737A87]
            ${compact ? 'line-clamp-2 text-[11px]' : 'text-[12px] sm:text-[13px]'}
          `}
        >
          {notification.message}
        </p>

        {notification.order && !compact && (
          <div
            className="
              mt-2 inline-flex items-center gap-2 rounded-lg bg-[#F5F7FB]
              px-2.5 py-1.5 text-[10px]
            "
          >
            <Icon name="orders" size={11} className="text-[#538CDB]" />
            <span className="font-mono font-semibold text-[#20242D]">
              #{notification.order.orderNumber}
            </span>
            {notification.order.orderType && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#D8DEE9]" />
                <span className="text-[#737A87]">
                  {notification.order.orderType}
                </span>
              </>
            )}
            {notification.order.items.length > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#D8DEE9]" />
                <span className="truncate text-[#737A87]">
                  {notification.order.items
                    .slice(0, 2)
                    .map((i) => `${i.productName} x${i.quantity}`)
                    .join(', ')}
                  {notification.order.items.length > 2 && '…'}
                </span>
              </>
            )}
          </div>
        )}

        {compact && (
          <p className="mt-1 text-[10px] text-[#A2A8B3]">
            {relativeTime(notification.createdAt)}
          </p>
        )}
      </div>
    </div>
  );

  const itemClass = `
    group block w-full text-left transition-colors
    ${
      compact
        ? isUnread
          ? 'bg-[#F5F5FF] hover:bg-[#EEF5FF]'
          : 'hover:bg-[#F5F7FB]'
        : isUnread
          ? 'bg-[#F5F5FF] hover:bg-[#EEF5FF]'
          : 'bg-white hover:bg-[#F5F7FB]'
    }
  `;

  if (link) {
    return (
      <Link
        to={link}
        onClick={handleClick}
        className={`${itemClass} ${compact ? 'px-3 py-2.5' : 'p-4 sm:p-5'}`}
      >
        {body}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${itemClass} ${compact ? 'px-3 py-2.5' : 'p-4 sm:p-5'}`}
    >
      {body}
    </button>
  );
};

export default NotificationItem;