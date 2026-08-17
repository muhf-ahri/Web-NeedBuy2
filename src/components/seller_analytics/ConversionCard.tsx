import React, { useEffect, useState } from 'react';

import Icon from '../ui/Icon';

interface ConversionCardProps {
  loading: boolean;
  error: string | null;
  conversionRate: number;
  orders: number;
  views: number;
  changePoint: number;
  previousRate: number;
  previousViews: number;
}

const ConversionCard: React.FC<ConversionCardProps> = ({
  loading,
  error,
  conversionRate,
  orders,
  views,
  changePoint,
  previousRate,
  previousViews,
}) => {
  const [animatedRate, setAnimatedRate] = useState(0);

  useEffect(() => {
    if (loading || error) return;
    const t = setTimeout(() => setAnimatedRate(conversionRate), 200);
    return () => clearTimeout(t);
  }, [conversionRate, loading, error]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const clampedRate = Math.min(Math.max(animatedRate, 0), 100);
  const dashOffset = circumference - (clampedRate / 100) * circumference;

  const isPositive = changePoint >= 0;

  return (
    <div
      className="
        relative overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 p-5 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
        backdrop-blur-sm sm:p-6
      "
    >
      
      <span
        className="
          pointer-events-none absolute -right-10 -top-10 h-24 w-24
          rounded-full border border-[#538CDB]/10
        "
      />
      <span
        className="
          pointer-events-none absolute right-4 top-4 h-1.5 w-1.5
          rounded-full bg-[#FFD500]
        "
      />

      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FDF4]">
          <Icon name="analytics" size={15} className="text-[#166534]" />
        </span>
        <div>
          <h3 className="text-[14px] font-bold text-[#20242D] sm:text-[15px]">
            Rasio Konversi
          </h3>
          <p className="text-[10px] text-[#737A87]">Order / kunjungan</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 animate-pulse rounded-full bg-[#F5F7FB]" />
          <div className="flex-1 space-y-2">
            <div className="h-8 w-24 animate-pulse rounded-full bg-[#F5F7FB]" />
            <div className="h-3 w-32 animate-pulse rounded-full bg-[#F5F7FB]" />
            <div className="h-3 w-20 animate-pulse rounded-full bg-[#F5F7FB]" />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-[#FF4646]/20 bg-[#FFF0F0] px-3 py-2 text-[12px] font-medium text-[#C73535]">
          {error}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          
          <div className="relative shrink-0">
            <svg width="96" height="96" viewBox="0 0 100 100" className="-rotate-90">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#F5F7FB"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="url(#conversion-gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22, 0.9, 0.35, 1)' }}
              />
              <defs>
                <linearGradient id="conversion-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5B93E0" />
                  <stop offset="100%" stopColor="#3A66AC" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px] font-extrabold leading-none tabular-nums text-[#20242D] sm:text-[24px]">
                {conversionRate.toFixed(1)}%
              </span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#A2A8B3]">
                Konversi
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-[#737A87]">
              <span className="font-bold text-[#20242D] tabular-nums">{orders}</span> order dari{' '}
              <span className="font-bold text-[#20242D] tabular-nums">{views}</span> kunjungan
            </p>

            {previousViews > 0 && (
              <div className="mt-2">
                <span
                  className={`
                    inline-flex items-center gap-1 rounded-full px-2 py-0.5
                    text-[10px] font-bold tabular-nums
                    ${
                      isPositive
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : 'bg-[#FFF0F0] text-[#C73535]'
                    }
                  `}
                >
                  <Icon
                    name={isPositive ? 'arrowUp' : 'arrowDown'}
                    size={9}
                    className={isPositive ? 'text-[#22C55E]' : 'text-[#FF4646]'}
                  />
                  {isPositive ? '+' : ''}
                  {Math.abs(changePoint).toFixed(1)} poin
                </span>
                <p className="mt-1 text-[10px] text-[#A2A8B3]">
                  vs {previousRate.toFixed(1)}% periode sebelumnya
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionCard;