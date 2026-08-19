import React from 'react';

import type { DashboardPeriod } from '../../api/dashboard';

interface PeriodFilterProps {
  value: DashboardPeriod;
  onChange: (p: DashboardPeriod) => void;
}

const PERIODS: Array<{ value: DashboardPeriod; label: string }> = [
  { value: 'day', label: 'Hari' },
  { value: 'week', label: 'Minggu' },
  { value: 'month', label: 'Bulan' },
  { value: 'year', label: 'Tahun' },
];

const PeriodFilter: React.FC<PeriodFilterProps> = ({ value, onChange }) => (
  <div
    className="
      inline-flex gap-0.5 rounded-full border border-white/80 bg-white/95
      p-1 shadow-[0_4px_14px_rgba(32,36,45,0.05)] backdrop-blur-sm
    "
  >
    {PERIODS.map((opt) => {
      const active = value === opt.value;
      return (
        <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
                relative rounded-full px-3 py-1.5 text-[11px] font-semibold
                transition-all duration-200 sm:px-4 sm:text-[12px]
                ${
                active
                    ? 'bg-[#004ac6] text-white shadow-[0_4px_12px_rgba(83,140,219,0.30)]'
                    : 'text-[#737686] hover:text-[#004ac6]'
                }
            `}
            >
          {active && (
            <span
              className="
                pointer-events-none absolute -right-0.5 -top-0.5 h-1 w-1
                rounded-full bg-[#FFD500] ring-2 ring-[#004ac6]
              "
            />
          )}
          {opt.label}
        </button>
      );
    })}
  </div>
);

export default PeriodFilter;