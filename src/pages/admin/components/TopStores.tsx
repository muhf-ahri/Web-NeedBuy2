// src/pages/admin/components/TopStores.tsx
import React from 'react';
import { formatRupiah } from '../../../utils/currency';
import type { TopStore } from '../data/analyticsData';

interface TopStoresProps {
  stores: TopStore[];
}

const TopStores: React.FC<TopStoresProps> = ({ stores }) => {
  return (
    <div className="space-y-3">
      {stores.map((store, idx) => (
        <div key={idx} className="flex items-center justify-between border-b border-[#f2f4f6] pb-2 last:border-0 last:pb-0">
          <div>
            <p className="text-[13px] font-medium text-[#191c1e]">{store.name}</p>
          </div>
          <div className="flex items-center gap-4 text-right">
            <span className="text-[13px] font-semibold text-[#004ac6]">
              {formatRupiah(store.sales)}
            </span>
            <span className="text-[12px] font-medium text-[#156b32] w-14">
              +{store.growth}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopStores;