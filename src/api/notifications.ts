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
  /** Metode bayar order — "tipe orderan" (MIDTRANS/COD). */
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

/** GET /notifications */
export const getNotifications = (params?: { limit?: number; unreadOnly?: boolean }) =>
  apiClient.get<ApiResponse<Notification[]>>('/notifications', {
    params: { limit: params?.limit, unreadOnly: params?.unreadOnly ? 'true' : undefined },
  });

/** GET /notifications/unread-count — sumber angka badge di bel header */
export const getUnreadCount = () =>
  apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');

/** PATCH /notifications/read-all */
export const readAllNotifications = () =>
  apiClient.patch<ApiResponse<{ updated: number; unreadCount: number }>>(
    '/notifications/read-all'
  );

/** PATCH /notifications/:id/read */
export const readNotification = (id: string) =>
  apiClient.patch<ApiResponse<{ unreadCount: number }>>(`/notifications/${id}/read`);

export type NotificationSocketEvent =
  | { event: 'notification'; data: Notification }
  | { event: 'unread-count'; data: { unreadCount: number } };

/**
 * URL WebSocket notifikasi, diturunkan dari VITE_API_BASE_URL supaya tidak ada
 * host kedua yang bisa ikut basi saat URL ngrok berganti. `/api/v1` dibuang
 * karena socket-nya dipasang di root server, bukan di bawah router API.
 */
export function notificationSocketUrl(token: string): string {
  const base = new URL(import.meta.env.VITE_API_BASE_URL, window.location.origin);
  base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:';
  base.pathname = '/ws/notifications';
  base.search = `?token=${encodeURIComponent(token)}`;
  return base.toString();
}
