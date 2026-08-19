import React, { useEffect, useState } from 'react';

import Icon from '../ui/Icon';
import type { InsightSeverity } from '../../api/shopAnalytics';

interface Insight {
  code: string;
  severity: InsightSeverity;
  message: string;
}

interface ShopInsightsCardProps {
  loading: boolean;
  error: string | null;
  insights: Insight[];
}

const SEVERITY_STYLE: Record<
  InsightSeverity,
  {
    box: string;
    iconBg: string;
    iconText: string;
    dotColor: string;
    label: string;
  }
> = {
  critical: {
    box: 'border-[#ba1a1a]/20 bg-[#FFF0F0]',
    iconBg: 'bg-[#ba1a1a]/15',
    iconText: 'text-[#ba1a1a]',
    dotColor: 'bg-[#ba1a1a]',
    label: 'Kritis',
  },
  warning: {
    box: 'border-[#FFD500]/30 bg-[#FFF7E0]/70',
    iconBg: 'bg-[#FFD500]/20',
    iconText: 'text-[#B45309]',
    dotColor: 'bg-[#FFD500]',
    label: 'Perhatian',
  },
  positive: {
    box: 'border-[#12805c]/20 bg-[#e6f4ee]',
    iconBg: 'bg-[#12805c]/15',
    iconText: 'text-[#12805c]',
    dotColor: 'bg-[#12805c]',
    label: 'Positif',
  },
  info: {
    box: 'border-[#004ac6]/20 bg-[#f5f7fb]',
    iconBg: 'bg-[#004ac6]/15',
    iconText: 'text-[#004ac6]',
    dotColor: 'bg-[#004ac6]',
    label: 'Info',
  },
};

const ShopInsightsCard: React.FC<ShopInsightsCardProps> = ({
  loading,
  error,
  insights,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (loading || error) return;
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, [loading, error]);

  return (
    <div
      className="
        relative overflow-hidden rounded-[24px] border border-[#004ac6]/20
        bg-gradient-to-br from-[#f5f7fb] via-white to-[#f5f7fb] p-5
        shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm sm:p-6
      "
    >
      
      <span
        className="
          pointer-events-none absolute -right-16 -top-16 h-40 w-40
          rounded-full border border-[#004ac6]/15
        "
      />
      <span
        className="
          pointer-events-none absolute right-12 top-8 h-1.5 w-1.5
          rounded-full bg-[#FFD500]
        "
      />
      <span
        className="
          pointer-events-none absolute right-24 top-20 h-1 w-1 rounded-full
          bg-[#004ac6]/50
        "
      />

      <div className="relative mb-4 flex items-center gap-2.5">
        <span
          className="
            flex h-9 w-9 items-center justify-center rounded-xl
            bg-gradient-to-br from-[#004ac6] to-[#003ea8]
            shadow-[0_6px_16px_rgba(83,140,219,0.30)]
          "
        >
          <Icon name="analytics" size={16} className="text-white" />
        </span>
        <div>
          <h3 className="text-[14px] font-bold text-[#101319] sm:text-[15px]">
            Shop Insights
          </h3>
          <p className="text-[10px] text-[#737686]">
            Dihitung otomatis dari data toko kamu pada periode terpilih
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-white/70"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-[#ba1a1a]/20 bg-[#FFF0F0] px-3 py-2 text-[12px] font-medium text-[#ba1a1a]">
          {error}
        </div>
      ) : insights.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <Icon name="analytics" size={16} className="text-[#A2A8B3]" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-[#101319]">
              Belum ada insight
            </p>
            <p className="text-[11px] text-[#737686]">
              Coba pilih periode yang lebih panjang biar datanya cukup.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {insights.map((insight, index) => {
            const style = SEVERITY_STYLE[insight.severity];
            const isVisible = mounted;

            return (
              <li
                key={insight.code}
                className={`
                  flex items-start gap-3 rounded-xl border px-3 py-2.5
                  transition-all duration-500 ease-out
                  ${style.box}
                  ${
                    isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-2 opacity-0'
                  }
                `}
                style={{
                  transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
                }}
              >
                <span
                  className={`
                    mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center
                    rounded-full ${style.iconBg}
                  `}
                >
                  <Icon
                    name={
                      insight.severity === 'critical'
                        ? 'alert'
                        : insight.severity === 'warning'
                          ? 'alert'
                          : insight.severity === 'positive'
                            ? 'check'
                            : 'trending'
                    }
                    size={12}
                    className={style.iconText}
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-[#101319] sm:text-[12px]">
                    {insight.message}
                  </p>
                </div>

                <span
                  className={`
                    shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold
                    uppercase tracking-wider ${style.iconBg} ${style.iconText}
                  `}
                >
                  {style.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ShopInsightsCard;