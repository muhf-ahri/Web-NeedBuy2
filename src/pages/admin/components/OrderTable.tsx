import React from 'react';
import { formatRupiah } from '../../../utils/currency';
import type { AdminOrder, OrderStatus, PaymentStatus } from '../../../api/admin';

interface OrderTableProps {
  orders: AdminOrder[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const statusLabel: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'Nunggu Bayar',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Sampai',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

const statusColor: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'bg-[#fff7e0] text-[#b45309]',
  PROCESSING: 'bg-[#dbe1ff] text-[#004ac6]',
  SHIPPED: 'bg-[#dbe1ff] text-[#004ac6]',
  DELIVERED: 'bg-[#e6f4ee] text-[#12805c]',
  COMPLETED: 'bg-[#e6f4ee] text-[#12805c]',
  CANCELLED: 'bg-[#fff0f0] text-[#93000a]',
};

const paymentColor: Record<PaymentStatus, string> = {
  PAID: 'bg-[#e6f4ee] text-[#12805c]',
  PENDING: 'bg-[#fff7e0] text-[#b45309]',
  FAILED: 'bg-[#fff0f0] text-[#93000a]',
  EXPIRED: 'bg-[#f2f4f6] text-[#737686]',
  REFUNDED: 'bg-[#dbe1ff] text-[#004ac6]',
};

export const paymentLabel: Record<PaymentStatus, string> = {
  PAID: 'Lunas',
  PENDING: 'Menunggu',
  FAILED: 'Gagal',
  EXPIRED: 'Kedaluwarsa',
  REFUNDED: 'Dikembalikan',
};

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  isLoading = false,
  emptyMessage = 'Tidak ada order.',
}) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={7} className="py-10 text-center text-[#737686]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#004ac6] border-t-transparent" />
          <span className="ml-2">Memuat…</span>
        </td>
      </tr>
    );
  }

  if (orders.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="py-10 text-center text-[#737686]">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return (
    <>
      {orders.map((order) => (
        <tr key={order.id} className="text-[13px] transition-colors hover:bg-[#f5f7fb]">
          <td className="py-2.5 pr-2 font-medium text-[#004ac6]">{order.orderNumber}</td>
          <td className="py-2.5 pr-2">
            <div className="font-medium text-[#101319]">{order.user.name}</div>
            <div className="text-[11px] text-[#737686]">{order.user.email}</div>
          </td>
          <td className="py-2.5 pr-2 text-[#434655]">{order.seller.storeName}</td>
          <td className="py-2.5 pr-2 text-center">{order.items.length} item</td>
          <td className="py-2.5 pr-2 font-semibold text-[#004ac6]">
            {formatRupiah(Number(order.total))}
          </td>
          <td className="py-2.5 pr-2 text-center">
            {order.payment ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${paymentColor[order.payment.status]}`}
              >
                {paymentLabel[order.payment.status]}
              </span>
            ) : (
              <span className="text-[11px] text-[#737686]">: </span>
            )}
          </td>
          <td className="py-2.5 text-center">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[order.status]}`}
            >
              {statusLabel[order.status]}
            </span>
          </td>
        </tr>
      ))}
    </>
  );
};

export default OrderTable;
