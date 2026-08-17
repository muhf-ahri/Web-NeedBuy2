import apiClient from './client';
import type { ApiResponse } from '../types';

export type NotificationType =
  | 'ORDER_NEW'
  | 'ORDER_STATUS'
  | 'PAYMENT'
  | 'LOW_STOCK'
  | 'REVIEW';

export interface NotificationOrder {
  orderId: string;
  orderNumber: string;

  orderType: string | null;
  status: string;
  total: number;
  items: { productId: string; productName: string; quantity: number }[];
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  order: NotificationOrder | null;
}

export const getNotifications = (params?: { limit?: number; unreadOnly?: boolean }) =>
  apiClient.get<ApiResponse<Notification[]>>('/notifications', {
    params: { limit: params?.limit, unreadOnly: params?.unreadOnly ? 'true' : undefined },
  });

export const getUnreadCount = () =>
  apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');

export const readAllNotifications = () =>
  apiClient.patch<ApiResponse<{ updated: number; unreadCount: number }>>(
    '/notifications/read-all'
  );

export const readNotification = (id: string) =>
  apiClient.patch<ApiResponse<{ unreadCount: number }>>(`/notifications/${id}/read`);

export type NotificationSocketEvent =
  | { event: 'notification'; data: Notification }
  | { event: 'unread-count'; data: { unreadCount: number } };

export function notificationSocketUrl(token: string): string {
  const base = new URL(import.meta.env.VITE_API_BASE_URL, window.location.origin);
  base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:';
  base.pathname = '/ws/notifications';
  base.search = `?token=${encodeURIComponent(token)}`;
  return base.toString();
}
