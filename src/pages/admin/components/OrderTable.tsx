// src/pages/admin/components/OrderTable.tsx
import React from 'react';
import Icon from '../../../components/ui/Icon';
import { formatRupiah } from '../../../utils/currency';
import type { Order } from '../data/ordersData';

interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const statusLabel: Record<Order['status'], string> = {
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const statusColor: Record<Order['status'], string> = {
  processing: 'bg-[#cfe8ff] text-[#0057b8]',
  completed: 'bg-[#d7f5dc] text-[#156b32]',
  cancelled: 'bg-[#ffe0e0] text-[#a33131]',
};

const paymentColor: Record<Order['paymentStatus'], string> = {
  Paid: 'bg-[#d7f5dc] text-[#156b32]',
  Pending: 'bg-[#fff4e0] text-[#b45309]',
  Failed: 'bg-[#ffe0e0] text-[#a33131]',
};

const paymentLabel: Record<Order['paymentStatus'], string> = {
  Paid: 'Lunas',
  Pending: 'Menunggu',
  Failed: 'Gagal',
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
        <tr key={order.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
          <td className="py-2.5 pr-2 font-medium text-[#004ac6]">
            {order.orderNumber}
          </td>
          <td className="py-2.5 pr-2">
            <div className="font-medium text-[#191c1e]">{order.buyer}</div>
            <div className="text-[11px] text-[#737686]">{order.buyerEmail}</div>
          </td>
          <td className="py-2.5 pr-2 text-[#434655]">{order.store}</td>
          <td className="py-2.5 pr-2 text-center">{order.items} item</td>
          <td className="py-2.5 pr-2 font-semibold text-[#004ac6]">
            {formatRupiah(order.totalAmount)}
          </td>
          <td className="py-2.5 pr-2 text-center">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${paymentColor[order.paymentStatus]}`}
            >
              {paymentLabel[order.paymentStatus]}
            </span>
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