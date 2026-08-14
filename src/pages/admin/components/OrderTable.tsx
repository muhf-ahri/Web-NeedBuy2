// src/pages/admin/components/OrderTable.tsx
import React from 'react';
import Icon from '../../../components/ui/Icon';
import { formatRupiah } from '../../../utils/currency';
import type { Order } from '../data/ordersData';

interface OrderTableProps {
  orders: Order[];
}

const statusColor: Record<string, string> = {
  Processing: 'bg-[#cfe8ff] text-[#0057b8]',
  Completed: 'bg-[#d7f5dc] text-[#156b32]',
  Cancelled: 'bg-[#ffe0e0] text-[#a33131]',
  Pending: 'bg-[#fff4e0] text-[#b45309]',
};

const paymentStatusColor: Record<string, string> = {
  Paid: 'bg-[#d7f5dc] text-[#156b32]',
  Pending: 'bg-[#fff4e0] text-[#b45309]',
  Failed: 'bg-[#ffe0e0] text-[#a33131]',
};

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="py-10 text-center text-[#737686]">Tidak ada order.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
            <th className="pb-2 pr-2 text-left">ID Order</th>
            <th className="pb-2 pr-2 text-left">Pembeli</th>
            <th className="pb-2 pr-2 text-left">Toko</th>
            <th className="pb-2 pr-2 text-left">Item</th>
            <th className="pb-2 pr-2 text-left">Total</th>
            <th className="pb-2 pr-2 text-left">Pembayaran</th>
            <th className="pb-2 pr-2 text-left">Status</th>
            <th className="pb-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f2f4f6]">
          {orders.map((order) => (
            <tr key={order.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
              <td className="py-2.5 pr-2 font-medium text-[#004ac6]">
                {order.orderNumber}
              </td>
              <td className="py-2.5 pr-2">
                <div className="font-medium text-[#191c1e]">{order.buyer.name}</div>
                <div className="text-[11px] text-[#737686]">{order.buyer.email}</div>
              </td>
              <td className="py-2.5 pr-2">{order.store}</td>
              <td className="py-2.5 pr-2">{order.items} item</td>
              <td className="py-2.5 pr-2 font-semibold text-[#004ac6]">
                {formatRupiah(order.totalAmount)}
              </td>
              <td className="py-2.5 pr-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${paymentStatusColor[order.paymentStatus]}`}
                >
                  {order.paymentStatus === 'Paid' ? 'Lunas' :
                   order.paymentStatus === 'Pending' ? 'Menunggu' : 'Gagal'}
                </span>
              </td>
              <td className="py-2.5 pr-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[order.orderStatus]}`}
                >
                  {order.orderStatus === 'Processing' ? 'Diproses' :
                   order.orderStatus === 'Completed' ? 'Selesai' :
                   order.orderStatus === 'Cancelled' ? 'Dibatalkan' : 'Menunggu'}
                </span>
              </td>
              <td className="py-2.5">
                <button
                  className="rounded-lg p-1.5 text-[#737686] transition-colors hover:bg-[#f2f4f6] hover:text-[#004ac6]"
                  aria-label="Lihat detail order"
                >
                  <Icon name="eye" size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;