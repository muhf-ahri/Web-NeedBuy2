import React from 'react';

import Icon from '../ui/Icon';

const SettingsHeader: React.FC = () => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538cbd]/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#4077a6]">
            Setelan Toko
          </p>
        </span>
      </div>
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#101319] sm:text-[28px]">
        Setelan Toko
      </h1>
      <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-[#737686] sm:text-[13px]">
        Kelola identitas toko, kontak, dan mode operasional di satu tempat.
      </p>
    </div>

    <div
      className="
        hidden h-12 w-12 items-center justify-center rounded-2xl
        bg-gradient-to-br from-[#538cbd] to-[#284a67]
        shadow-[0_6px_16px_rgba(83,140,219,0.30)] sm:flex
      "
    >
      <Icon name="settings" size={22} className="text-white" />
    </div>
  </div>
);

export default SettingsHeader;