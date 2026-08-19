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

interface OrdersTableRowProps {
  order: SellerOrder;
  statusLabel: string;
  action: SellerAction | undefined;
  isExpanded: boolean;
  isBusy: boolean;
  onToggleExpand: () => void;
  onAdvance: () => void;
  formatDate: (iso: string) => string;
}

const OrdersTableRow: React.FC<OrdersTableRowProps> = ({
  order,
  statusLabel,
  action,
  isExpanded,
  isBusy,
  onToggleExpand,
  onAdvance,
  formatDate,
}) => (
  <>
    <tr className="group border-b border-[#F5F7FB] transition-colors last:border-0 hover:bg-[#f5f7fb]/60">

      <td className="px-4 py-3.5">
        <p className="font-mono text-[11px] font-bold text-[#4077a6]">
          #{order.orderNumber}
        </p>
      </td>

      <td className="px-4 py-3.5">
        <p className="truncate text-[13px] font-semibold text-[#101319]">
          {order.user.name}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-[#737686]">
          {order.user.email}
        </p>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap text-[12px] text-[#737686]">
        {formatDate(order.createdAt)}
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="text-[13px] font-bold text-[#101319] tabular-nums">
          {formatRupiah(Number(order.total))}
        </p>
        <p className="mt-0.5 text-[10px] text-[#737686]">
          {order.totalBarang} barang
        </p>
      </td>

      <td className="px-4 py-3.5 text-[11px] text-[#434655]">
        {order.statusPembayaranLabel}
      </td>

      <td className="px-4 py-3.5">
        <span
          className={`
            inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px]
            font-semibold whitespace-nowrap ${STATUS_CLASS[order.status]}
          `}
        >
          {statusLabel}
        </span>
      </td>

      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          {action && (
            <button
              type="button"
              onClick={onAdvance}
              disabled={isBusy}
              className="
                flex items-center gap-1.5 rounded-full bg-[#4077a6] px-3
                py-1.5 text-[11px] font-semibold text-white
                shadow-[0_4px_12px_rgba(83,140,219,0.25)] transition-all
                duration-200 hover:bg-[#4077a6]
                hover:shadow-[0_6px_16px_rgba(83,140,219,0.30)]
                active:scale-[0.98] disabled:cursor-not-allowed
                disabled:bg-[#A2A8B3] disabled:shadow-none
              "
            >
              {isBusy ? (
                <Icon name="clock" size={11} className="animate-spin" />
              ) : (
                <Icon
                  name={action.to === 'SHIPPED' ? 'truck' : 'check'}
                  size={11}
                />
              )}
              {action.label}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleExpand}
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              text-[#737686] transition-all duration-200
              hover:bg-[#f5f7fb] hover:text-[#4077a6]
            "
            aria-label={isExpanded ? 'Tutup detail' : 'Lihat detail'}
            title={isExpanded ? 'Tutup detail' : 'Lihat detail'}
          >
            <Icon
              name={isExpanded ? 'chevronUp' : 'chevronDown'}
              size={15}
            />
          </button>
        </div>
      </td>
    </tr>

    {isExpanded && (
      <tr className="bg-[#f5f7fb]/50">
        <td colSpan={7} className="px-4 py-4 sm:px-6">
          <OrdersExpandedDetail order={order} />
        </td>
      </tr>
    )}
  </>
);

export default OrdersTableRow;