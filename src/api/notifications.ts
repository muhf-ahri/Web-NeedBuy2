import apiClient from './client';
import type { ApiResponse } from '../types';

export type NotificationType =
  | 'ORDER_NEW'
  | 'ORDER_STATUS'
  | 'PAYMENT'
  | 'LOW_STOCK'
  | 'REVIEW' | 'CHAT';

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

export const getNotifications = (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) =>
  apiClient.get<ApiResponse<Notification[]>>('/notifications', {
    params: {
      page: params?.page,
      limit: params?.limit,
      unreadOnly: params?.unreadOnly ? 'true' : undefined,
    },
  });

export const getUnreadCount = () =>
  apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');

export const readAllNotifications = () =>
  apiClient.patch<ApiResponse<{ updated: number; unreadCount: number }>>(
    '/notifications/read-all'
  );

export const readNotification = (id: string) =>
  apiClient.patch<ApiResponse<{ unreadCount: number }>>(`/notifications/${id}/read`);

/**
 * Menandai terbaca semua notifikasi yang cocok dengan `cocok`.
 *
 * Dipakai supaya notifikasi hilang sendiri begitu isinya sudah dilihat:
 * membuka halaman pesan melunasi notifikasi chat, membuka lacak paket
 * melunasi notifikasi order itu. Sebelumnya notifikasi tidak pernah ditandai
 * terbaca dari mana pun, jadi lonceng terus menyala walau semuanya sudah
 * dibaca.
 *
 * Sengaja memakai endpoint per-notifikasi yang sudah ada, bukan menambah
 * endpoint baru: jumlah notifikasi yang belum terbaca selalu kecil, dan
 * kegagalannya tidak boleh mengganggu halaman yang sedang dibuka.
 */
export async function markReadWhere(
  cocok: (n: Notification) => boolean
): Promise<number> {
  try {
    const res = await getNotifications({ limit: 50, unreadOnly: true });
    const target = (res.data.data ?? []).filter(cocok);
    await Promise.allSettled(target.map((n) => readNotification(n.id)));
    return target.length;
  } catch {
    return 0;
  }
}

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
