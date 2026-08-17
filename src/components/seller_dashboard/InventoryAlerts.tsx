import React from 'react';

import Icon from '../ui/Icon';

export interface InventoryAlert {
  productId: string;
  productName: string;
  stock: number;
  level: 'LOW_STOCK' | 'OUT_OF_STOCK';
}

interface InventoryAlertsProps {
  items: InventoryAlert[];
  outOfStockCount: number;
  lowStockCount: number;
  loading: boolean;
  error: string | null;
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({
  items,
  outOfStockCount,
  lowStockCount,
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
            bg-[#FFF0F0]
          "
        >
          <Icon name="alert" size={15} className="text-[#FF4646]" />
        </span>
        <div>
          <h3 className="text-[14px] font-bold text-[#20242D] sm:text-[15px]">
            Stok yang Perlu Dicek
          </h3>
          <p className="text-[10px] text-[#737A87]">
            Produk dengan stok menipis atau habis
          </p>
        </div>
      </div>

      {!loading && !error && (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="
              inline-flex items-center gap-1 rounded-full bg-[#FFF0F0]
              px-2 py-0.5 text-[9px] font-semibold text-[#C73535]
            "
          >
            <span className="h-1 w-1 rounded-full bg-[#FF4646]" />
            {outOfStockCount} habis
          </span>
          <span
            className="
              inline-flex items-center gap-1 rounded-full bg-[#FFF7E0]
              px-2 py-0.5 text-[9px] font-semibold text-[#B45309]
            "
          >
            <span className="h-1 w-1 rounded-full bg-[#FFD500]" />
            {lowStockCount} menipis
          </span>
        </div>
      )}
    </div>

    {loading ? (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-xl bg-[#F5F7FB]"
          />
        ))}
      </div>
    ) : error ? (
      <div
        className="
          rounded-xl border border-[#FF4646]/20 bg-[#FFF0F0] px-3 py-2
          text-[12px] font-medium text-[#C73535]
        "
      >
        {error}
      </div>
    ) : items.length === 0 ? (
      <div
        className="
          flex items-center gap-3 rounded-xl bg-[#F0FDF4] px-4 py-6
          text-center
        "
      >
        <span
          className="
            flex h-10 w-10 items-center justify-center rounded-full
            bg-white
          "
        >
          <Icon name="check" size={16} className="text-[#22C55E]" />
        </span>
        <div className="text-left">
          <p className="text-[13px] font-semibold text-[#166534]">
            Semua stok masih aman
          </p>
          <p className="text-[11px] text-[#166534]/70">
            Tidak ada produk yang perlu dicek saat ini.
          </p>
        </div>
      </div>
    ) : (
      <ul className="space-y-1.5">
        {items.slice(0, 5).map((alert) => {
          const isOut = alert.level === 'OUT_OF_STOCK';
          return (
            <li
              key={alert.productId}
              className="
                flex items-center gap-3 rounded-xl border border-[#F5F7FB]
                px-3 py-2.5 transition-colors hover:border-[#FF4646]/30
                hover:bg-[#FFF0F0]/50
              "
            >
              <span
                className={`
                  flex h-7 w-7 shrink-0 items-center justify-center
                  rounded-lg ${isOut ? 'bg-[#FFF0F0]' : 'bg-[#FFF7E0]'}
                `}
              >
                <Icon
                  name="alert"
                  size={12}
                  className={isOut ? 'text-[#FF4646]' : 'text-[#B45309]'}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-[#20242D]">
                  {alert.productName}
                </p>
                <p
                  className={`
                    text-[10px] font-medium
                    ${isOut ? 'text-[#C73535]' : 'text-[#B45309]'}
                  `}
                >
                  {isOut ? 'Stok habis' : `Stok tinggal ${alert.stock}`}
                </p>
              </div>
              <span
                className={`
                  shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold
                  ${isOut ? 'bg-[#FFF0F0] text-[#C73535]' : 'bg-[#FFF7E0] text-[#B45309]'}
                `}
              >
                {alert.stock} tersisa
              </span>
            </li>
          );
        })}
        {items.length > 5 && (
          <p className="mt-2 text-center text-[11px] text-[#A2A8B3]">
            + {items.length - 5} produk lainnya
          </p>
        )}
      </ul>
    )}
  </div>
);

export default InventoryAlerts;