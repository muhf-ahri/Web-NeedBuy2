import React from 'react';

import Icon from '../ui/Icon';
import OrdersExpandedDetail from './OrdersExpandedDetail';
import { formatRupiah } from '../../utils/currency';
import type { OrderStatus, SellerOrder } from '../../api/orders';

const STATUS_CLASS: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'bg-[#F5F7FB] text-[#737686]',
  PROCESSING: 'bg-[#FFF7E0] text-[#B45309]',
  SHIPPED: 'bg-[#f5f7fb] text-[#4077a6]',
  DELIVERED: 'bg-[#e6f4ee] text-[#12805c]',
  COMPLETED: 'bg-[#e6f4ee] text-[#12805c]',
  CANCELLED: 'bg-[#FFF0F0] text-[#ba1a1a]',
};

interface SellerAction {
  to: 'SHIPPED' | 'DELIVERED';
  label: string;
}

interface OrdersCardItemProps {
  order: SellerOrder;
  statusLabel: string;
  action: SellerAction | undefined;
  isExpanded: boolean;
  isBusy: boolean;
  onToggleExpand: () => void;
  onAdvance: () => void;
  formatDate: (iso: string) => string;
}

const OrdersCardItem: React.FC<OrdersCardItemProps> = ({
  order,
  statusLabel,
  action,
  isExpanded,
  isBusy,
  onToggleExpand,
  onAdvance,
  formatDate,
}) => (
  <div
    className="
      overflow-hidden rounded-[20px] border border-white/80 bg-white/95
      shadow-[0_6px_18px_rgba(32,36,45,0.05)] backdrop-blur-sm
      transition-all duration-200 hover:-translate-y-0.5
      hover:shadow-[0_10px_26px_rgba(32,36,45,0.08)]
    "
  >

    <div className="flex items-start justify-between gap-2 p-3.5 sm:p-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-mono text-[11px] font-bold text-[#4077a6]">
            #{order.orderNumber}
          </span>
          <span
            className={`
              inline-flex items-center rounded-full px-2 py-0.5 text-[9px]
              font-semibold uppercase tracking-wider
              ${STATUS_CLASS[order.status]}
            `}
          >
            {statusLabel}
          </span>
        </div>

        <p className="mt-1.5 truncate text-[13px] font-bold text-[#101319] sm:text-[14px]">
          {order.user.name}
        </p>
        <p className="truncate text-[11px] text-[#737686]">{order.user.email}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[13px] font-extrabold text-[#101319] tabular-nums sm:text-[14px]">
            {formatRupiah(Number(order.total))}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-[#e0e3e5]" />
          <span className="text-[10px] text-[#737686]">
            {order.totalBarang} barang · {formatDate(order.createdAt)}
          </span>
        </div>
      </div>
    </div>

    <div className="flex gap-2 border-t border-[#F5F7FB] px-3.5 py-2.5 sm:px-4">
      {action && (
        <button
          type="button"
          onClick={onAdvance}
          disabled={isBusy}
          className="
            flex flex-1 items-center justify-center gap-1.5 rounded-full
            bg-[#4077a6] py-2 text-[11px] font-semibold text-white
            shadow-[0_4px_12px_rgba(83,140,219,0.25)] transition-all
            duration-200 hover:bg-[#4077a6]
            hover:shadow-[0_6px_16px_rgba(83,140,219,0.30)]
            active:scale-[0.98] disabled:cursor-not-allowed
            disabled:bg-[#A2A8B3] disabled:shadow-none
          "
        >
          {isBusy ? (
            <Icon name="clock" size={12} className="animate-spin" />
          ) : (
            <Icon
              name={action.to === 'SHIPPED' ? 'truck' : 'check'}
              size={12}
            />
          )}
          {action.label}
        </button>
      )}

      <button
        type="button"
        onClick={onToggleExpand}
        className={`
          flex flex-1 items-center justify-center gap-1.5 rounded-full border
          py-2 text-[11px] font-semibold transition-all duration-200
          active:scale-[0.98]
          ${
            isExpanded
              ? 'border-[#538cbd] bg-[#f5f7fb] text-[#4077a6]'
              : 'border-[#e0e3e5] bg-white text-[#101319] hover:border-[#538cbd] hover:text-[#4077a6]'
          }
        `}
      >
        <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={12} />
        {isExpanded ? 'Tutup' : 'Detail'}
      </button>
    </div>

    {isExpanded && (
      <div className="border-t border-[#F5F7FB] bg-[#f5f7fb]/50 p-3.5 sm:p-4">
        <OrdersExpandedDetail order={order} />
      </div>
    )}
  </div>
);

export default OrdersCardItem;