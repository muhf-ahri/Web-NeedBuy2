import React from 'react';

import Icon from '../ui/Icon';

interface NeedsHeroProps {
  showCreate: boolean;
  onToggle: () => void;
}

const NeedsHero: React.FC<NeedsHeroProps> = ({ showCreate, onToggle }) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="
            inline-flex items-center gap-1.5 rounded-full bg-[#004ac6]/10
            px-2.5 py-1
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <p
            className="
              text-[9px] font-bold uppercase tracking-[0.20em] text-[#004ac6]
            "
          >
            Belanja pintar
          </p>
        </span>
      </div>

      <h1
        className="
          text-[26px] font-extrabold leading-tight tracking-tight
          text-[#101319] sm:text-[32px]
        "
      >
        Kebutuhan Saya
      </h1>
      <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#737686]">
        Ceritain kebutuhanmu dalam kalimat bebas, AI akan menganalisis dan
        mencarikan produk yang paling pas untukmu.
      </p>
    </div>

    <button
      type="button"
      onClick={onToggle}
      className="
        flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#004ac6]
        px-5 text-[13px] font-semibold text-white
        shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
        duration-200 hover:bg-[#004ac6]
        hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)] active:scale-[0.99]
      "
    >
      {showCreate ? (
        <Icon name="close" size={15} />
      ) : (
        <Icon name="plus" size={15} />
      )}
      {showCreate ? 'Tutup' : 'Tulis Kebutuhan'}
    </button>
  </div>
);

export default NeedsHero;