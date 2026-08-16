import type { OrderStatus } from '../../api/orders';

export type TabKey = OrderStatus | 'ALL' | 'HISTORY';

export const STATUS_TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'ALL', label: 'Semua' },
  { key: 'HISTORY', label: 'Riwayat' },
  { key: 'WAITING_PAYMENT', label: 'Nunggu Dibayar' },
  { key: 'PROCESSING', label: 'Diproses' },
  { key: 'SHIPPED', label: 'Dikirim' },
  { key: 'DELIVERED', label: 'Selesai' },
  { key: 'COMPLETED', label: 'Ditinjau' },
  { key: 'CANCELLED', label: 'Dibatalkan' },
];

export const STATUS_STYLE: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'bg-[#FFF7E0] text-[#B45309]',
  PROCESSING: 'bg-[#EEF5FF] text-[#538CDB]',
  SHIPPED: 'bg-[#DBEAFE] text-[#0369A1]',
  DELIVERED: 'bg-[#DCFCE7] text-[#166534]',
  COMPLETED: 'bg-[#F5F5FF] text-[#538CDB]',
  CANCELLED: 'bg-[#FFF0F0] text-[#C73535]',
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'Nunggu Dibayar',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Selesai',
  COMPLETED: 'Ditinjau',
  CANCELLED: 'Dibatalkan',
};

export const isSettled = (status: OrderStatus) =>
  status === 'COMPLETED' || status === 'DELIVERED';

export const historyLabel = (status: OrderStatus) =>
  status === 'CANCELLED'
    ? 'Dibatalkan'
    : isSettled(status)
      ? 'Selesai'
      : 'Belum selesai';

export const historyStyle = (status: OrderStatus) =>
  status === 'CANCELLED'
    ? 'bg-[#FFF0F0] text-[#C73535]'
    : isSettled(status)
      ? 'bg-[#DCFCE7] text-[#166534]'
      : 'bg-[#FFF7E0] text-[#B45309]';

export const dateTimeLabel = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const ONLINE_CHANNELS = [
  'MIDTRANS',
  'qris',
  'gopay',
  'shopeepay',
  'bank_transfer',
  'echannel',
  'bca_klikpay',
  'cimb_clicks',
  'danamon_online',
  'akulaku',
];

export const paymentMethodLabel = (
  method: string | null | undefined
): string => {
  if (!method) return 'Bayar Online';
  if (method === 'COD') return 'COD — Bayar di Tempat';
  return ONLINE_CHANNELS.includes(method)
    ? `Bayar via ${method}`
    : method;
};