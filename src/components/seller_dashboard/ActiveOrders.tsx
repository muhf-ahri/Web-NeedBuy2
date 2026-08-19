import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';

export interface ActiveOrderItem {
  orderId: string;
  orderNumber: string;
  customer: string;
  itemCount: number;
  amount: string | number;
  statusLabel: string;
}

interface ActiveOrdersProps {
  items: ActiveOrderItem[];
  totalActive: number;
  loading: boolean;
  error: string | null;
}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({
  items,
  totalActive,
  loading,
  error,
}) => (
  <div
    className="
      relative overflow-hidden rounded-[24px] border border-white/80
      bg-white/95 p-5 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
      backdrop-blur-sm sm:p-6
    "
  >
    
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span
          className="
            flex h-8 w-8 items-center justify-center rounded-lg
            bg-[#004ac6]/10
          "
        >
          <Icon name="orders" size={15} className="text-[#004ac6]" />
        </span>
        <div>
          <h3 className="text-[14px] font-bold text-[#101319] sm:text-[15px]">
            Order yang Jalan
          </h3>
          <p className="text-[10px] text-[#737686]">
            Pesanan yang sedang diproses
          </p>
        </div>
      </div>

      {!loading && !error && totalActive > 0 && (
        <span
          className="
            inline-flex items-center gap-1 rounded-full bg-[#f5f7fb]
            px-2 py-0.5 text-[10px] font-semibold text-[#004ac6]
          "
        >
          <span className="h-1 w-1 animate-pulse rounded-full bg-[#004ac6]" />
          {totalActive} aktif
        </span>
      )}
    </div>

    {loading ? (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl bg-[#F5F7FB]"
          />
        ))}
      </div>
    ) : error ? (
      <div
        className="
          rounded-xl border border-[#ba1a1a]/20 bg-[#FFF0F0] px-3 py-2
          text-[12px] font-medium text-[#ba1a1a]
        "
      >
        {error}
      </div>
    ) : items.length === 0 ? (
      <div
        className="
          flex items-center gap-3 rounded-xl bg-[#F5F7FB] px-4 py-6
        "
      >
        <span
          className="
            flex h-10 w-10 items-center justify-center rounded-full
            bg-white
          "
        >
          <Icon name="orders" size={16} className="text-[#A2A8B3]" />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[#101319]">
            Belum ada order aktif
          </p>
          <p className="text-[11px] text-[#737686]">
            Order yang masuk akan muncul di sini.
          </p>
        </div>
      </div>
    ) : (
      <>
        <ul className="space-y-1.5">
          {items.slice(0, 5).map((order) => (
            <li
              key={order.orderId}
              className="
                flex items-center justify-between gap-3 rounded-xl border
                border-[#F5F7FB] px-3 py-2.5 transition-colors
                hover:border-[#004ac6]/30 hover:bg-[#f5f7fb]/50
              "
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[11px] font-bold text-[#004ac6]">
                  #{order.orderNumber}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-[#737686]">
                  {order.customer} · {order.itemCount} barang
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[12px] font-bold text-[#101319] tabular-nums">
                  {formatRupiah(order.amount)}
                </p>
                <span
                  className="
                    mt-0.5 inline-flex items-center gap-1 rounded-full
                    bg-[#FFF7E0] px-1.5 py-0.5 text-[9px] font-semibold
                    text-[#B45309]
                  "
                >
                  <span className="h-1 w-1 rounded-full bg-[#FFD500]" />
                  {order.statusLabel}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <Link
          to="/seller/orders"
          className="
            mt-4 flex h-10 w-full items-center justify-center gap-2
            rounded-full border border-[#e0e3e5] bg-white text-[12px]
            font-semibold text-[#101319] transition-all duration-200
            hover:border-[#004ac6] hover:text-[#004ac6] active:scale-[0.99]
          "
        >
          Lihat semua order
          <Icon name="arrowRight" size={13} />
        </Link>
      </>
    )}
  </div>
);

export default ActiveOrders;