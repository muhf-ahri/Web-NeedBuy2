import type { IconName } from '../ui/Icon';
import type { Notification } from '../../api/notifications';

export function relativeTime(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'baru saja';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'kemarin' : `${days} hari lalu`;
}

export function linkFor(notification: Notification, role?: string): string | undefined {
  const isSeller = role === 'SELLER';
  switch (notification.type) {
    // Notifikasi penjual: orderan masuk dan stok menipis.
    case 'ORDER_NEW':
      return '/seller/orders';
    case 'LOW_STOCK':
      return '/seller/products';
    // Notifikasi pembeli. Sebelumnya keduanya diarahkan ke /seller/orders,
    // sehingga pembeli yang menekan "Pesanan dikirim" dilempar ke halaman
    // dasbor penjual yang bukan miliknya.
    case 'ORDER_STATUS':
    case 'PAYMENT':
      return '/orders';
    case 'CHAT':
      return isSeller ? '/seller/chats' : '/messages';
    default:
      return undefined;
  }
}

export function metaFor(notification: Notification): {
  icon: IconName;
  bg: string;
  text: string;
  label: string;
} {
  switch (notification.type) {
    case 'LOW_STOCK':
      return {
        icon: 'alert',
        bg: 'bg-[#FFF7E0]',
        text: 'text-[#B45309]',
        label: 'Stok menipis',
      };
    case 'PAYMENT':
      return {
        icon: 'card',
        bg: 'bg-[#e6f4ee]',
        text: 'text-[#12805c]',
        label: 'Pembayaran',
      };
    case 'ORDER_NEW':
      return {
        icon: 'orders',
        bg: 'bg-[#f5f7fb]',
        text: 'text-[#4077a6]',
        label: 'Pesanan baru',
      };
    case 'ORDER_STATUS':
      return {
        icon: 'truck',
        bg: 'bg-[#f5f7fb]',
        text: 'text-[#4077a6]',
        label: 'Update pesanan',
      };
    case 'CHAT':
      return {
        icon: 'chat',
        bg: 'bg-[#e4ebf1]',
        text: 'text-[#4077a6]',
        label: 'Pesan baru',
      };
    default:
      return {
        icon: 'bell',
        bg: 'bg-[#F5F7FB]',
        text: 'text-[#737686]',
        label: 'Info',
      };
  }
}