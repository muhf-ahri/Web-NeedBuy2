import React, { useEffect, useRef, useState } from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { SalesPoint } from '../../api/dashboard';

interface RevenueChartProps {
  points: SalesPoint[];
  granularity: string;
  total?: { revenue: string | number; orders: string | number };
}

const labelFor = (iso: string, granularity: string) => {
  const date = new Date(iso);
  if (granularity === 'hour')
    return `${String(date.getHours()).padStart(2, '0')}.00`;
  if (granularity === 'month')
    return date.toLocaleDateString('id-ID', { month: 'short' });
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

const compactValue = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}jt`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}rb`;
  return String(Math.round(v));
};

const RevenueChart: React.FC<RevenueChartProps> = ({
  points,
  granularity,
  total,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, [points]);

  useEffect(() => {
    const check = () => {
      const w = containerRef.current?.offsetWidth ?? 0;
      setIsSmall(w < 480);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (points.length === 0) {
    return (
      <div
        className="
          flex h-60 items-center justify-center rounded-2xl border
          border-dashed border-[#e0e3e5] bg-[#F5F7FB]/50
        "
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <Icon name="analytics" size={20} className="text-[#A2A8B3]" />
          </div>
          <p className="mt-3 text-[13px] font-semibold text-[#101319]">
            Belum ada pendapatan
          </p>
          <p className="mt-1 text-[11px] text-[#737686]">
            Data grafik akan muncul begitu ada transaksi.
          </p>
        </div>
      </div>
    );
  }

  const max = Math.max(...points.map((p) => p.revenue), 1);

  const maxLabels = isSmall ? 4 : 8;
  const step = Math.max(1, Math.ceil(points.length / maxLabels));
  const xAxisLabels = points
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => i === 0 || i === points.length - 1 || i % step === 0);

  return (
    <div ref={containerRef}>
      {total && (
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#737686]">
          <span>
            Total{' '}
            <span className="font-bold text-[#004ac6] tabular-nums">
              {formatRupiah(Number(total.revenue))}
            </span>
          </span>
          <span className="h-1 w-1 rounded-full bg-[#e0e3e5]" />
          <span>
            <span className="font-bold text-[#101319] tabular-nums">
              {total.orders}
            </span>{' '}
            order
          </span>
        </div>
      )}

      <div className="relative flex h-56 items-end gap-1 sm:h-64 sm:gap-2">
        {points.map((point, index) => {
          const heightPct = (point.revenue / max) * 100;
          const isHovered = hoverIndex === index;

          return (
            <div
              key={point.bucket}
              className="
                group relative flex flex-1 flex-col items-center justify-end
                h-full
              "
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {isHovered && (
                <div
                  className="
                    pointer-events-none absolute -top-16 z-10 w-max
                    rounded-lg border border-white/80 bg-[#101319]/95 px-2.5
                    py-1.5 text-center shadow-[0_6px_16px_rgba(32,36,45,0.20)]
                    backdrop-blur-sm
                  "
                >
                  <p className="text-[9px] text-white/60">
                    {labelFor(point.bucket, granularity)}
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold text-white tabular-nums">
                    {formatRupiah(point.revenue)}
                  </p>
                </div>
              )}

              <span
                className={`
                  mb-1 text-[8px] font-bold tabular-nums transition-all
                  duration-300 sm:text-[9px]
                  ${
                    isHovered
                      ? 'text-[#004ac6] opacity-100'
                      : 'text-[#A2A8B3] opacity-0 group-hover:opacity-100'
                  }
                `}
              >
                {compactValue(point.revenue)}
              </span>

              <div
                className={`
                  relative w-full overflow-hidden rounded-t-md
                  transition-all duration-200
                  ${
                    isHovered
                      ? 'bg-gradient-to-t from-[#003ea8] to-[#004ac6] shadow-[0_-4px_12px_rgba(83,140,219,0.40)]'
                      : 'bg-gradient-to-t from-[#004ac6] to-[#004ac6]/80'
                  }
                `}
                style={{
                  height: mounted ? `${heightPct}%` : '0%',
                  minHeight: mounted ? '2px' : '0px',
                  transition: `height 0.7s cubic-bezier(0.22, 0.9, 0.35, 1) ${index * 40}ms`,
                }}
                title={`${labelFor(point.bucket, granularity)} · ${formatRupiah(point.revenue)}`}
              >
                <span
                  className={`
                    pointer-events-none absolute inset-0 bg-gradient-to-t
                    from-transparent via-white/10 to-white/20 transition-opacity
                    duration-200
                    ${isHovered ? 'opacity-100' : 'opacity-0'}
                  `}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between">
        {xAxisLabels.map(({ p, i }) => (
          <span
            key={i}
            className={`
              text-[9px] tabular-nums transition-colors sm:text-[10px]
              ${hoverIndex === i ? 'font-bold text-[#004ac6]' : 'text-[#A2A8B3]'}
            `}
          >
            {labelFor(p.bucket, granularity)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;