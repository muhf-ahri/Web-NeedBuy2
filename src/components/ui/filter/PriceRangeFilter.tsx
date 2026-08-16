import React, { useEffect, useState } from 'react';

import Icon from '../Icon';

interface PriceRangeFilterProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  /** Delay (ms) sebelum onChange ke parent — default 400 */
  debounceMs?: number;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Maks',
  debounceMs = 400,
}) => {
  /* Internal state — selalu sinkron dengan keyboard user, jadi input
     tidak pernah "terkunci". Parent hanya dapat update setelah debounce. */
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  // Sinkronisasi internal ← external (mis. reset dari parent)
  useEffect(() => setLocalMin(minValue), [minValue]);
  useEffect(() => setLocalMax(maxValue), [maxValue]);

  // Debounce ke parent — parent tidak dibombardir onChange tiap keystroke
  useEffect(() => {
    if (localMin === minValue) return; // sudah sinkron, skip
    const timer = setTimeout(() => onMinChange(localMin), debounceMs);
    return () => clearTimeout(timer);
  }, [localMin, debounceMs, minValue, onMinChange]);

  useEffect(() => {
    if (localMax === maxValue) return;
    const timer = setTimeout(() => onMaxChange(localMax), debounceMs);
    return () => clearTimeout(timer);
  }, [localMax, debounceMs, maxValue, onMaxChange]);

  const hasValue = localMin !== '' || localMax !== '';

  const handleReset = () => {
    setLocalMin('');
    setLocalMax('');
    onMinChange('');
    onMaxChange('');
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {/* Input Min */}
        <div
          className="
            flex h-8 min-w-0 flex-1 items-center rounded-full border
            border-[#E8ECF4] bg-[#F5F7FB] transition-all duration-200
            focus-within:border-[#538CDB] focus-within:bg-white
            focus-within:shadow-[0_3px_10px_rgba(83,140,219,0.10)]
          "
        >
          <span className="pl-2.5 pr-1 text-[10px] font-bold text-[#737A87]">
            Rp
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={minPlaceholder}
            min="0"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="
              min-w-0 flex-1 bg-transparent pr-2.5 text-[11px] font-medium
              text-[#20242D] outline-none placeholder:text-[#A2A8B3]
              [appearance:textfield]
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
            "
          />
        </div>

        <span className="shrink-0 text-[10px] text-[#A2A8B3]">–</span>

        {/* Input Max */}
        <div
          className="
            flex h-8 min-w-0 flex-1 items-center rounded-full border
            border-[#E8ECF4] bg-[#F5F7FB] transition-all duration-200
            focus-within:border-[#538CDB] focus-within:bg-white
            focus-within:shadow-[0_3px_10px_rgba(83,140,219,0.10)]
          "
        >
          <span className="pl-2.5 pr-1 text-[10px] font-bold text-[#737A87]">
            Rp
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={maxPlaceholder}
            min="0"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="
              min-w-0 flex-1 bg-transparent pr-2.5 text-[11px] font-medium
              text-[#20242D] outline-none placeholder:text-[#A2A8B3]
              [appearance:textfield]
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
            "
          />
        </div>
      </div>

      {/* Reset */}
      {hasValue && (
        <button
          type="button"
          onClick={handleReset}
          className="
            inline-flex items-center gap-1 text-[10px] font-semibold
            text-[#737A87] transition-colors hover:text-[#538CDB]
          "
        >
          <Icon name="close" size={10} />
          Reset harga
        </button>
      )}
    </div>
  );
};

export default PriceRangeFilter;