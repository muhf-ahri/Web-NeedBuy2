import React from 'react';
import { formatRupiah } from '../../../utils/currency';

export interface TopCategory {
  name: string;
  revenue: number;
  percentage: number;
}

interface TopCategoriesProps {
  categories: TopCategory[];
}

const TopCategories: React.FC<TopCategoriesProps> = ({ categories }) => {
  if (categories.length === 0) {
    return (
      <p className="py-6 text-center text-[13px] text-[#737686]">
        Belum ada penjualan di periode ini.
      </p>
    );
  }

  const maxRevenue = Math.max(...categories.map((c) => c.revenue));

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <div key={cat.name}>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#434655]">{cat.name}</span>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[#101319]">{formatRupiah(cat.revenue)}</span>
              <span className="w-10 text-right text-[11px] text-[#737686]">{cat.percentage}%</span>
            </div>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-[#f2f4f6]">
            <div
              className="h-1.5 rounded-full bg-[#004ac6]"
              style={{ width: maxRevenue > 0 ? `${(cat.revenue / maxRevenue) * 100}%` : '0%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCategories;
