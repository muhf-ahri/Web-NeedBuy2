import React from 'react';

import OrdersCardItem from './OrdersCardItem';
import type { SellerOrder } from '../../api/orders';

interface SellerAction {
  to: 'SHIPPED' | 'DELIVERED';
  label: string;
}

interface OrdersMobileListProps {
  orders: SellerOrder[];
  expandedId: string | null;
  busyId: string | null;
  getAction: (o: SellerOrder) => SellerAction | undefined;
  getStatusLabel: (o: SellerOrder) => string;
  formatDate: (iso: string) => string;
  onToggleExpand: (id: string) => void;
  onAdvance: (o: SellerOrder) => void;
}

const OrdersMobileList: React.FC<OrdersMobileListProps> = ({
  orders,
  expandedId,
  busyId,
  getAction,
  getStatusLabel,
  formatDate,
  onToggleExpand,
  onAdvance,
}) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
    {orders.map((order) => (
      <OrdersCardItem
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
  </div>
);

export default OrdersMobileList;