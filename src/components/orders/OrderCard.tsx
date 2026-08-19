import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import {
  STATUS_STYLE,
  STATUS_LABEL,
  dateLabel,
} from './orders.helpers';
import type { Order } from '../../api/orders';

interface OrderCardProps {
  order: Order;
  onOpen: (id: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onOpen }) => {
  const navigate = useNavigate();
  const status = STATUS_STYLE[order.status];

  return (
    <button
      type="button"
      onClick={() => onOpen(order.id)}
      className="
        group w-full overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 p-4 text-left shadow-[0_8px_24px_rgba(32,36,45,0.06)]
        backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5
        hover:shadow-[0_14px_36px_rgba(32,36,45,0.10)] sm:p-5
      "
    >

      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`
              inline-flex items-center gap-1 rounded-full px-2.5 py-1
              text-[11px] font-semibold ${status}
            `}
          >
            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
            {STATUS_LABEL[order.status]}
          </span>
          <span className="font-mono text-[11px] font-semibold text-[#737686]">
            #{order.orderNumber}
          </span>
        </div>
        <Icon
          name="chevronRight"
          size={16}
          className="
            shrink-0 text-[#A2A8B3] transition-transform duration-200
            group-hover:translate-x-0.5 group-hover:text-[#4077a6]
          "
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex shrink-0 items-center -space-x-2">
            {order.items.slice(0, 3).map((item) => {
              const img =
                item.product?.images?.find((image) => image.isPrimary)?.url ||
                item.product?.images?.[0]?.url ||
                '';
              return (
                <div
                  key={item.id}
                  className="
                    flex h-11 w-11 items-center justify-center overflow-hidden
                    rounded-xl bg-[#F5F7FB] ring-2 ring-white
                  "
                >
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon name="orders" size={18} className="text-[#A2A8B3]" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#101319]">
              {order.items[0]?.productName ?? 'Produk'}
              {order.totalBarang > 1
                ? ` + ${order.totalBarang - 1} lainnya`
                : ''}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-[#737686]">
              {order.seller.storeName} · {dateLabel(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[14px] font-bold text-[#101319] sm:text-[15px]">
            {formatRupiah(order.total)}
          </p>
          {order.status === 'WAITING_PAYMENT' ? (
            <p className="mt-0.5 text-[11px] font-semibold text-[#B45309]">
              Nunggu dibayar
            </p>
          ) : (
            <span
              role="link"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/orders/${order.id}/track`);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/orders/${order.id}/track`);
                }
              }}
              className="
                mt-0.5 inline-flex cursor-pointer items-center gap-1
                text-[11px] font-semibold text-[#4077a6] hover:underline
              "
            >
              <Icon name="truck" size={12} />
              Lacak paket
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default OrderCard;