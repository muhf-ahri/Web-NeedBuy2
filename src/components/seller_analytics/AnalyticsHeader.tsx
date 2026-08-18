import React from 'react';


interface AnalyticsHeaderProps {
  period: string;
  onPeriodChange: (p: 'day' | 'week' | 'month' | 'year') => void;
}

const PERIODS: Array<{ value: 'day' | 'week' | 'month' | 'year'; label: string }> = [
  { value: 'day', label: 'Hari' },
  { value: 'week', label: 'Minggu' },
  { value: 'month', label: 'Bulan' },
  { value: 'year', label: 'Tahun' },
];

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  period,
  onPeriodChange,
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538CDB]/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#538CDB]">
            Analitik Toko
          </p>
        </span>
      </div>
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#20242D] sm:text-[28px]">
        Analitik Toko
      </h1>
      <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-[#737A87] sm:text-[13px]">
        Lihat performa toko dan temukan peluang pertumbuhan dari datamu.
      </p>
    </div>

    <div
      className="
        inline-flex w-fit gap-0.5 rounded-full border border-white/80
        bg-white/95 p-1 shadow-[0_4px_14px_rgba(32,36,45,0.05)]
        backdrop-blur-sm
      "
    >
      {PERIODS.map((opt) => {
        const active = period === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPeriodChange(opt.value)}
            className={`
              relative rounded-full px-3.5 py-1.5 text-[12px] font-semibold
              transition-all duration-200 sm:px-4
              ${
                active
                  ? 'bg-[#538CDB] text-white shadow-[0_4px_12px_rgba(83,140,219,0.30)]'
                  : 'text-[#737A87] hover:text-[#538CDB]'
              }
            `}
          >
            {active && (
              <span
                className="
                  pointer-events-none absolute -right-0.5 -top-0.5 h-1 w-1
                  rounded-full bg-[#FFD500] ring-2 ring-[#538CDB]
                "
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default AnalyticsHeader;