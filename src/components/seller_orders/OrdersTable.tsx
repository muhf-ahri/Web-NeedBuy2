import React from 'react';

import OrdersTableRow from './OrdersTableRow';
import type { SellerOrder } from '../../api/orders';

interface SellerAction {
  to: 'SHIPPED' | 'DELIVERED';
  label: string;
}

interface OrdersTableProps {
  orders: SellerOrder[];
  expandedId: string | null;
  busyId: string | null;
  getAction: (o: SellerOrder) => SellerAction | undefined;
  getStatusLabel: (o: SellerOrder) => string;
  formatDate: (iso: string) => string;
  onToggleExpand: (id: string) => void;
  onAdvance: (o: SellerOrder) => void;
}

const Th: React.FC<{ children: React.ReactNode; align?: 'left' | 'right' }> = ({
  children,
  align = 'left',
}) => (
  <th
    className={`
      px-4 py-3 text-${align} text-[10px] font-bold uppercase tracking-wider
      text-[#737686]
    `}
  >
    {children}
  </th>
);

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  expandedId,
  busyId,
  getAction,
  getStatusLabel,
  formatDate,
  onToggleExpand,
  onAdvance,
}) => (
  <div className="overflow-x-auto">
    <table className="stack-table w-full">
      <thead>
        <tr className="border-b border-[#F5F7FB] bg-[#F5F7FB]/50">
          <Th>ID Order</Th>
          <Th>Nama Pembeli</Th>
          <Th>Tanggal</Th>
          <Th>Total</Th>
          <Th>Bayar</Th>
          <Th>Status</Th>
          <Th align="right">Aksi</Th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <OrdersTableRow
            key={order.id}
            order={order}
            statusLabel={getStatusLabel(order)}
            action={getAction(order)}
            isExpanded={expandedId === order.id}
            isBusy={busyId === order.id}
            onToggleExpand={() => onToggleExpand(order.id)}
            onAdvance={() => onAdvance(order)}
            formatDate={formatDate}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default OrdersTable;