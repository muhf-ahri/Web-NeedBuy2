// src/pages/admin/components/RevenueChart.tsx
import React from 'react';
import { formatRupiah } from '../../../utils/currency';
import type { RevenuePoint } from '../data/analyticsData';

interface RevenueChartProps {
  data: RevenuePoint[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="mt-4 h-48">
      <div className="flex h-full items-end justify-between gap-1.5">
        {data.map((point, idx) => {
          const height = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={idx} className="flex flex-1 flex-col items-center">
              <div
                className="w-full rounded-t bg-gradient-to-t from-[#004ac6] to-[#1a5fc7] transition-all duration-300 hover:opacity-80"
                style={{ height: `${height}%`, minHeight: '8px' }}
              />
              <span className="mt-2 text-[10px] text-[#737686]">{point.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;