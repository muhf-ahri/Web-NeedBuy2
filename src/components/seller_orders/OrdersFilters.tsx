import React, { useRef, useEffect } from 'react';

import Icon from '../ui/Icon';
import type { OrderStatus } from '../../api/orders';

type FilterValue = OrderStatus | 'ALL';

interface OrdersFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: FilterValue;
  onStatusChange: (v: FilterValue) => void;
}

const STATUS_FILTERS: Array<{ value: FilterValue; label: string }> = [
  { value: 'ALL', label: 'Semua' },
  { value: 'WAITING_PAYMENT', label: 'Belum Dibayar' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'SHIPPED', label: 'Dikirim' },
  { value: 'DELIVERED', label: 'Sampai' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Batal' },
];

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const active = scrollRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (active) {
      const container = scrollRef.current;
      const offset = active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    }
  }, [status]);

  return (
    <div
      className="
        space-y-3 rounded-[20px] border border-white/80 bg-white/95 p-3
        shadow-[0_6px_18px_rgba(32,36,45,0.05)] backdrop-blur-sm sm:p-4
      "
    >
      
      <div className="relative">
        <Icon
          name="search"
          size={16}
          className="
            pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2
            text-[#A2A8B3]
          "
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari no. order, pembeli, atau produk..."
          className="
            w-full rounded-full border border-[#e0e3e5] bg-[#F5F7FB] py-2.5
            pl-10 pr-10 text-[13px] text-[#101319] outline-none
            placeholder:text-[#A2A8B3] transition-all duration-200
            focus:border-[#004ac6] focus:bg-white
            focus:shadow-[0_4px_14px_rgba(83,140,219,0.10)]
          "
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="
              absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2
              items-center justify-center rounded-full text-[#A2A8B3]
              transition-colors hover:bg-white hover:text-[#101319]
            "
            aria-label="Hapus pencarian"
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="
          flex gap-1.5 overflow-x-auto overscroll-contain pb-1
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {STATUS_FILTERS.map((opt) => {
          const active = status === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              data-active={active}
              onClick={() => onStatusChange(opt.value)}
              className={`
                shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold
                transition-all duration-200 active:scale-[0.97] sm:text-[12px]
                ${
                  active
                    ? 'bg-[#004ac6] text-white shadow-[0_4px_12px_rgba(83,140,219,0.30)]'
                    : 'border border-[#e0e3e5] bg-white text-[#737686] hover:border-[#004ac6]/50 hover:text-[#004ac6]'
                }
              `}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersFilters;