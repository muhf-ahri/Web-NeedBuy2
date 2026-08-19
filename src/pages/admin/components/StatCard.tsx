import React from 'react';
import Icon, { type IconName } from '../../../components/ui/Icon';
import { formatRupiah } from '../../../utils/currency';

interface StatCardProps {
  title: string;
  value: number | string;
  
  change: number | null;
  changeLabel?: string;
  icon: IconName;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs 30 hari sebelumnya',
  icon,
  isCurrency = false,
}) => {
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
          <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-[#737686] sm:text-[11px]">
            {title}
          </p>
          <p className="mt-1 truncate text-xl font-bold leading-tight text-[#101319] sm:text-2xl">
            {displayValue}
          </p>
          <p
            className={`mt-1 truncate text-[11px] font-medium sm:text-[12px] ${
              change === null ? 'text-[#737686]' : change >= 0 ? 'text-[#12805c]' : 'text-[#ba1a1a]'
            }`}
          >
            {change === null
              ? 'Belum ada pembanding'
              : `${change >= 0 ? '+' : ''}${change}% ${changeLabel}`}
          </p>
        </div>
        <div className="shrink-0 rounded-full bg-[#e4ebf1] p-2 text-[#4077a6] sm:p-2.5">
          <Icon name={icon} size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
