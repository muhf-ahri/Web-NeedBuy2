import React from 'react';

import Icon from '../ui/Icon';
import SearchSuggestions from '../ui/SearchSuggestions';

interface SearchHeroProps {
  input: string;
  onInputChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  suggestOpen: boolean;
  setSuggestOpen: (open: boolean) => void;
  onClear: () => void;
}

const SearchHero: React.FC<SearchHeroProps> = ({
  input,
  onInputChange,
  onSubmit,
  suggestOpen,
  setSuggestOpen,
  onClear,
}) => (
  <div className="mb-6">
    
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="
            inline-flex items-center gap-1.5 rounded-full bg-[#538cbd]/10
            px-2.5 py-1
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <p
            className="
              text-[9px] font-bold uppercase tracking-[0.20em] text-[#4077a6]
            "
          >
            Pencarian
          </p>
        </span>
      </div>
      <h1
        className="
          text-[26px] font-extrabold leading-tight tracking-tight
          text-[#101319] sm:text-[32px]
        "
      >
        Hasil Pencarian
      </h1>
      <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#737686]">
        Cari produk, toko, atau apa pun yang kamu butuhkan, kami bantu
        menemukan yang paling pas.
      </p>
    </div>

    <form onSubmit={onSubmit} className="relative">
      <div
        className="
          group flex items-center gap-2 rounded-full border border-[#e0e3e5]
          bg-white px-2 py-1.5 transition-all duration-200
          focus-within:border-[#538cbd]
          focus-within:shadow-[0_6px_20px_rgba(83,140,219,0.12)]
        "
      >
        <span
          className="
            flex h-9 w-9 shrink-0 items-center justify-center rounded-full
            text-[#737686] transition-colors duration-200
            group-focus-within:bg-[#538cbd]/10 group-focus-within:text-[#4077a6]
          "
        >
          <Icon name="search" size={17} />
        </span>

        <input
          type="text"
          value={input}
          onChange={(e) => {
            onInputChange(e.target.value);
            setSuggestOpen(true);
          }}
          onFocus={() => setSuggestOpen(true)}
          onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSuggestOpen(false);
          }}
          placeholder="Mau cari apa hari ini?"
          className="
            min-w-0 flex-1 bg-transparent py-2 text-[13px] text-[#101319]
            outline-none placeholder:text-[#A2A8B3]
          "
        />

        {input && (
          <button
            type="button"
            onClick={onClear}
            className="
              flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              text-[#A2A8B3] transition-colors hover:bg-[#F5F7FB]
              hover:text-[#101319]
            "
            aria-label="Hapus pencarian"
          >
            <Icon name="close" size={14} />
          </button>
        )}

        <button
          type="submit"
          className="
            flex h-10 w-10 shrink-0 items-center justify-center rounded-full
            bg-[#4077a6] text-white shadow-[0_6px_16px_rgba(83,140,219,0.25)]
            transition-all duration-200 hover:bg-[#4077a6]
            hover:shadow-[0_8px_20px_rgba(83,140,219,0.30)]
            active:scale-[0.95]
          "
          aria-label="Cari"
        >
          <Icon name="arrowRight" size={15} />
        </button>
      </div>

      {suggestOpen && (
        <SearchSuggestions term={input} onPick={() => setSuggestOpen(false)} />
      )}
    </form>
  </div>
);

export default SearchHero;