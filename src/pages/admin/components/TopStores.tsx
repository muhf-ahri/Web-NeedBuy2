// src/pages/admin/components/TopStores.tsx
import React from 'react';
import { formatRupiah } from '../../../utils/currency';

export interface TopStore {
  name: string;
  sales: number;
  /** null = periode sebelumnya nol, jadi pertumbuhannya nggak bisa dihitung. */
  growth: number | null;
}

interface TopStoresProps {
  stores: TopStore[];
}

const TopStores: React.FC<TopStoresProps> = ({ stores }) => {
  if (stores.length === 0) {
    return (
      <p className="py-6 text-center text-[13px] text-[#737686]">
        Belum ada toko yang jualan di periode ini.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {stores.map((store) => (
        <div
          key={store.name}
          className="flex items-center justify-between border-b border-[#f2f4f6] pb-2 last:border-0 last:pb-0"
        >
          <p className="text-[13px] font-medium text-[#191c1e]">{store.name}</p>
          <div className="flex items-center gap-4 text-right">
            <span className="text-[13px] font-semibold text-[#004ac6]">
              {formatRupiah(store.sales)}
            </span>
            <span
              className={`w-16 text-[12px] font-medium ${
                store.growth === null
                  ? 'text-[#737686]'
                  : store.growth >= 0
                  ? 'text-[#156b32]'
                  : 'text-[#ba1a1a]'
              }`}
            >
              {store.growth === null ? '—' : `${store.growth >= 0 ? '+' : ''}${store.growth}%`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopStores;
