import React from 'react';

export interface RevenuePoint {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenuePoint[];
}

const MONTH_LABEL = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const label = (month: string) => MONTH_LABEL[Number(month.slice(5, 7)) - 1] ?? month;

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-[13px] text-[#737686]">
        Belum ada pendapatan buat digambar.
      </p>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="mt-4 h-48">
      <div className="flex h-full items-end justify-between gap-1.5">
        {data.map((point) => {
          const height = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={point.month} className="flex flex-1 flex-col items-center">
              <div
                className="w-full rounded-t bg-gradient-to-t from-[#538cbd] to-[#538cbd] transition-all duration-300 hover:opacity-80"
                style={{ height: `${height}%`, minHeight: '8px' }}
                title={point.month}
              />
              <span className="mt-2 text-[10px] text-[#737686]">{label(point.month)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;
