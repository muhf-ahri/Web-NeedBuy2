// src/components/ui/NotificationBell.tsx
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const dummyNotifications: Notification[] = [
  { id: '1', title: 'New Order', message: 'Order #ORD-001 has been placed.', time: '5 min ago', read: false, link: '/seller/orders' },
  { id: '2', title: 'Low Stock Alert', message: 'Mechanical Keyboard is running low (2 left).', time: '1 hour ago', read: false, link: '/seller/products' },
  { id: '3', title: 'Product Review', message: 'Emily Chen left a 5-star review on Wireless Mouse.', time: '3 hours ago', read: true },
  { id: '4', title: 'Payment Received', message: 'Payment for order #ORD-002 confirmed.', time: 'Yesterday', read: true, link: '/seller/orders' },
];

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[#f2f4f6] transition-colors"
        aria-label="Notifications"
      >
        <Icon name="bell" size={20} className="text-[#434655]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e0e3e5] overflow-hidden z-50 animate-slideDown">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e3e5]">
            <span className="text-[13px] font-bold text-[#191c1e]">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-[#004ac6] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-[13px] text-[#737686]">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-[#f2f4f6] last:border-0 transition-colors hover:bg-[#f8f9fb] ${
                    !notification.read ? 'bg-[#f2f6ff]' : ''
                  }`}
                >
                  {notification.link ? (
                    <Link
                      to={notification.link}
                      onClick={() => {
                        markAsRead(notification.id);
                        setIsOpen(false);
                      }}
                      className="block"
                    >
                      <p className="text-[13px] font-semibold text-[#191c1e]">
                        {notification.title}
                      </p>
                      <p className="text-[12px] text-[#737686] mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-[#c3c6d7] mt-1">
                        {notification.time}
                      </p>
                    </Link>
                  ) : (
                    <div>
                      <p className="text-[13px] font-semibold text-[#191c1e]">
                        {notification.title}
                      </p>
                      <p className="text-[12px] text-[#737686] mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-[#c3c6d7] mt-1">
                        {notification.time}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t border-[#e0e3e5] text-center">
            <Link
              to="/seller/notifications"
              className="text-[12px] text-[#004ac6] hover:underline"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;