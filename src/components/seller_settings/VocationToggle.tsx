import React from 'react';

import Icon from '../ui/Icon';

interface VacationToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  productCount: number;
}

const VacationToggle: React.FC<VacationToggleProps> = ({
  checked,
  onChange,
  productCount,
}) => (
  <label
    className={`
      flex cursor-pointer items-start gap-3 rounded-2xl border p-4
      transition-all duration-200
      ${
        checked
          ? 'border-[#FFD500]/40 bg-[#FFF7E0]/50'
          : 'border-[#e0e3e5] bg-[#F5F7FB]/30 hover:border-[#004ac6]/40 hover:bg-[#f5f7fb]/50'
      }
    `}
  >
    <span
      className={`
        flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
        transition-colors
        ${checked ? 'bg-[#FFF7E0] text-[#B45309]' : 'bg-white text-[#737686]'}
      `}
    >
      <Icon name={checked ? 'alert' : 'moon'} size={18} />
    </span>

    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-bold text-[#101319]">Mode Libur</p>
        <span
          className={`
            rounded-full px-2 py-0.5 text-[9px] font-bold uppercase
            tracking-wider
            ${
              checked
                ? 'bg-[#FFF7E0] text-[#B45309]'
                : 'bg-[#F5F7FB] text-[#A2A8B3]'
            }
          `}
        >
          {checked ? 'Aktif' : 'Nonaktif'}
        </span>
      </div>

      <p className="mt-1 text-[11px] leading-relaxed text-[#737686]">
        Saat aktif, <span className="font-bold text-[#101319]">{productCount}</span> produk
        kamu tetap bisa dilihat tapi pembeli tidak bisa menambahkannya ke
        keranjang atau checkout. Order yang sudah masuk tetap harus diproses
        seperti biasa.
      </p>
    </div>

    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
    <span
      className={`
        relative mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full
        p-0.5 transition-colors
        ${checked ? 'bg-[#004ac6]' : 'bg-[#e0e3e5]'}
      `}
    >
      <span
        className={`
          h-4 w-4 rounded-full bg-white shadow-sm transition-transform
          ${checked ? 'translate-x-4' : 'translate-x-0'}
        `}
      />
    </span>
  </label>
);

export default VacationToggle;