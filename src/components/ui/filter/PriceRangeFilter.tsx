import React, { useEffect, useState } from 'react';

import Icon from '../Icon';

interface PriceRangeFilterProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Maks',
}) => {
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  useEffect(() => setLocalMin(minValue), [minValue]);
  useEffect(() => setLocalMax(maxValue), [maxValue]);

  // Dulu nilai diterapkan sendiri setelah jeda 400ms, jadi mengetik "150000"
  // menembakkan beberapa pencarian berturut-turut dan daftarnya berkedip di
  // tengah pengetikan. Sekarang hanya Enter yang menerapkan — mengetik tidak
  // mengubah apa pun sampai user memutuskan selesai.
  const terapkan = () => {
    if (localMin !== minValue) onMinChange(localMin);
    if (localMax !== maxValue) onMaxChange(localMax);
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    terapkan();
  };

  const belumDiterapkan = localMin !== minValue || localMax !== maxValue;

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
        
        <div
          className="
            flex h-8 min-w-0 flex-1 items-center rounded-full border
            border-[#e0e3e5] bg-[#F5F7FB] transition-all duration-200
            focus-within:border-[#538cbd] focus-within:bg-white
            focus-within:shadow-[0_3px_10px_rgba(83,140,219,0.10)]
          "
        >
          <span className="pl-2.5 pr-1 text-[10px] font-bold text-[#737686]">
            Rp
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={minPlaceholder}
            min="0"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onKeyDown={onEnter}
            className="
              min-w-0 flex-1 bg-transparent pr-2.5 text-[11px] font-medium
              text-[#101319] outline-none placeholder:text-[#A2A8B3]
              [appearance:textfield]
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
            "
          />
        </div>

        <span className="shrink-0 text-[10px] font-medium text-[#A2A8B3]">s/d</span>

        <div
          className="
            flex h-8 min-w-0 flex-1 items-center rounded-full border
            border-[#e0e3e5] bg-[#F5F7FB] transition-all duration-200
            focus-within:border-[#538cbd] focus-within:bg-white
            focus-within:shadow-[0_3px_10px_rgba(83,140,219,0.10)]
          "
        >
          <span className="pl-2.5 pr-1 text-[10px] font-bold text-[#737686]">
            Rp
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={maxPlaceholder}
            min="0"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onKeyDown={onEnter}
            className="
              min-w-0 flex-1 bg-transparent pr-2.5 text-[11px] font-medium
              text-[#101319] outline-none placeholder:text-[#A2A8B3]
              [appearance:textfield]
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
            "
          />
        </div>
      </div>

      {belumDiterapkan && (
        <button
          type="button"
          onClick={terapkan}
          className="
            inline-flex items-center gap-1 text-[10px] font-semibold
            text-[#4077a6] transition-colors hover:text-[#284a67]
          "
        >
          <Icon name="check" size={10} />
          Terapkan · atau tekan Enter
        </button>
      )}

      {hasValue && !belumDiterapkan && (
        <button
          type="button"
          onClick={handleReset}
          className="
            inline-flex items-center gap-1 text-[10px] font-semibold
            text-[#737686] transition-colors hover:text-[#4077a6]
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