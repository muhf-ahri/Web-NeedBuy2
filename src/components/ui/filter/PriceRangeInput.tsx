import React from 'react';

interface PriceRangeFilterProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

const inputClassName =
  'w-full pl-7 pr-2 py-1.5 text-[12px] border border-[#c3c6d7] rounded-lg outline-none focus:border-[#538cbd] focus:ring-2 focus:ring-[#538cbd]/20 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = '0',
  maxPlaceholder = 'Maks',
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#737686]">Rp</span>
        <input
          type="number"
          placeholder={minPlaceholder}
          min="0"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          className={inputClassName}
        />
      </div>
      <span className="text-[#737686] text-[11px] font-medium">s/d</span>
      <div className="flex-1 relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#737686]">Rp</span>
        <input
          type="number"
          placeholder={maxPlaceholder}
          min="0"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          className={inputClassName}
        />
      </div>
    </div>
  );
};

export default PriceRangeFilter;