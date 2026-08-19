import React from 'react';

import Icon, { type IconName } from '../ui/Icon';
import GrowthBadge from './GrowthBadge';

interface StatCardProps {
  title: string;
  icon: IconName;
  iconBg: string;
  iconText: string;
  loading: boolean;
  error: string | null;

  value: string;
  subtitle?: string;

  growth?: number;
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  iconBg,
  iconText,
  loading,
  error,
  value,
  subtitle,
  growth,
  children,
}) => (
  <div
    className="
      relative h-full overflow-hidden rounded-[24px] border border-white/80
      bg-white/95 p-4 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
      backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5
      hover:shadow-[0_14px_36px_rgba(32,36,45,0.10)] sm:p-5
    "
  >

    <span
      className="
        pointer-events-none absolute -right-10 -top-10 h-24 w-24
        rounded-full border border-[#004ac6]/10
      "
    />
    <span
      className="
        pointer-events-none absolute -right-4 top-8 h-1.5 w-1.5
        rounded-full bg-[#FFD500]
      "
    />

    <div className="relative flex items-center justify-between">
      <span
        className={`
          flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}
          ${iconText}
        `}
      >
        <Icon name={icon} size={18} />
      </span>
      {typeof growth === 'number' && <GrowthBadge value={growth} />}
    </div>

    <p
      className="
        relative mt-4 text-[10px] font-bold uppercase tracking-[0.16em]
        text-[#737686]
      "
    >
      {title}
    </p>

    {loading ? (
      <div className="mt-2 space-y-2">
        <div className="h-7 w-28 animate-pulse rounded-full bg-[#F5F7FB]" />
        <div className="h-3 w-20 animate-pulse rounded-full bg-[#F5F7FB]" />
      </div>
    ) : error ? (
      <p className="mt-2 text-[12px] font-medium text-[#ba1a1a]">{error}</p>
    ) : (
      <>
        <p
          className="
            mt-1.5 truncate text-[20px] font-extrabold leading-tight
            tracking-tight text-[#101319] tabular-nums sm:text-[26px]
          "
        >
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-[11px] text-[#737686]">{subtitle}</p>
        )}
        {children}
      </>
    )}
  </div>
);

export default StatCard;