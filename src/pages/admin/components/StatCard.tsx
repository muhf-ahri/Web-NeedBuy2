// src/pages/admin/components/StatCard.tsx
import React from 'react';
import Icon, { type IconName } from '../../../components/ui/Icon';
import { formatRupiah } from '../../../utils/currency';

interface StatCardProps {
  title: string;
  value: number | string;
  change: string;
  icon: IconName;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  isCurrency = false,
}) => {
  const isPositive = change.startsWith('+');

  // Format value
  let displayValue: string;
  if (isCurrency && typeof value === 'number') {
    displayValue = formatRupiah(value);
  } else if (typeof value === 'number') {
    displayValue = value.toLocaleString('id-ID');
  } else {
    displayValue = value;
  }

  return (
    <div className="rounded-2xl border border-[#e0e3e5] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#737686] truncate">
            {title}
          </p>
          <p className="mt-1 text-xl sm:text-2xl font-bold leading-tight text-[#191c1e] truncate">
            {displayValue}
          </p>
          <p
            className={`mt-1 text-[11px] sm:text-[12px] font-medium truncate ${
              isPositive ? 'text-[#156b32]' : 'text-[#ba1a1a]'
            }`}
          >
            {change} vs last 30 days
          </p>
        </div>
        <div className="shrink-0 rounded-full bg-[#dbe1ff] p-2 sm:p-2.5 text-[#004ac6]">
          <Icon name={icon} size={18} sm:size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;