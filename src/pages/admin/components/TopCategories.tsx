// src/pages/admin/components/TopCategories.tsx
import React from 'react';
import { formatRupiah } from '../../../utils/currency';
import type { TopCategory } from '../data/analyticsData';

interface TopCategoriesProps {
  categories: TopCategory[];
}

const TopCategories: React.FC<TopCategoriesProps> = ({ categories }) => {
  const maxRevenue = Math.max(...categories.map((c) => c.revenue));

  return (
    <div className="space-y-3">
      {categories.map((cat, idx) => (
        <div key={idx}>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#434655]">{cat.name}</span>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[#191c1e]">
                {formatRupiah(cat.revenue)}
              </span>
              <span className="text-[#737686] text-[11px] w-10 text-right">
                {cat.percentage}%
              </span>
            </div>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-[#f2f4f6]">
            <div
              className="h-1.5 rounded-full bg-[#004ac6]"
              style={{ width: `${(cat.revenue / maxRevenue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCategories;