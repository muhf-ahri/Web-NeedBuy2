import type { IconName } from '../ui/Icon';
import type { Notification } from '../../api/notifications';

/** "5 menit lalu" tanpa library tanggal. */
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

/** Target link untuk setiap tipe notifikasi. */
export function linkFor(notification: Notification): string | undefined {
  switch (notification.type) {
    case 'ORDER_NEW':
    case 'ORDER_STATUS':
    case 'PAYMENT':
      return '/seller/orders';
    case 'LOW_STOCK':
      return '/seller/products';
    default:
      return undefined;
  }
}

/** Icon & warna sesuai tipe notifikasi. */
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
        bg: 'bg-[#DCFCE7]',
        text: 'text-[#166534]',
        label: 'Pembayaran',
      };
    case 'ORDER_NEW':
      return {
        icon: 'orders',
        bg: 'bg-[#EEF5FF]',
        text: 'text-[#538CDB]',
        label: 'Pesanan baru',
      };
    case 'ORDER_STATUS':
      return {
        icon: 'truck',
        bg: 'bg-[#EEF5FF]',
        text: 'text-[#538CDB]',
        label: 'Update pesanan',
      };
    default:
      return {
        icon: 'bell',
        bg: 'bg-[#F5F7FB]',
        text: 'text-[#737A87]',
        label: 'Info',
      };
  }
}