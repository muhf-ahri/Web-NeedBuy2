// src/components/home/HomeSearch.tsx
import React from 'react';
import Icon from '../ui/Icon';
import SearchSuggestions from '../ui/SearchSuggestions';

interface HomeSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  suggestOpen: boolean;
  setSuggestOpen: (open: boolean) => void;
}

const HomeSearch: React.FC<HomeSearchProps> = ({
  value,
  onChange,
  onSubmit,
  suggestOpen,
  setSuggestOpen,
}) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-7 sm:px-8">
      <div
        className="
          relative
          overflow-visible
          rounded-[24px]
          border border-white
          bg-white/75
          p-3
          shadow-[0_15px_45px_rgba(53,91,139,0.10)]
          backdrop-blur-xl
          sm:max-w-3xl
        "
      >
        <div className="mb-2 flex items-center gap-2 px-2">
          <span
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-xl
              bg-[#edf4ff]
              text-[#004ac6]
            "
          >
            <Icon name="search" size={15} />
          </span>

          <div>
            <p className="text-[11px] font-bold text-[#191c1e]">
              Lagi cari apa?
            </p>

            <p className="text-[9px] text-[#737686]">
              Tulis kebutuhanmu, kami bantu cari.
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="
            relative
            flex items-center gap-2
            rounded-2xl
            border border-transparent
            bg-[#f4f7fb]
            px-3 py-1.5
            transition-all duration-200
            focus-within:border-[#b9cef4]
            focus-within:bg-white
            focus-within:shadow-[0_4px_20px_rgba(0,74,198,0.08)]
          "
        >
          <Icon
            name="search"
            size={16}
            className="shrink-0 text-[#737686]"
          />

          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setSuggestOpen(true);
            }}
            onFocus={() => setSuggestOpen(true)}
            onBlur={() => setSuggestOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSuggestOpen(false);
              }
            }}
            placeholder="Contoh: laptop buat edit video, budget 15 juta..."
            className="
              min-w-0
              flex-1
              bg-transparent
              py-2
              text-[12px]
              text-[#191c1e]
              outline-none
              placeholder-[#8a90a0]
            "
          />

          <button
            type="submit"
            className="
              flex h-9 w-9
              shrink-0
              items-center justify-center
              rounded-xl
              bg-[#004ac6]
              text-white
              shadow-[0_5px_15px_rgba(0,74,198,0.20)]
              transition-all
              hover:bg-[#003a9e]
              hover:shadow-[0_7px_20px_rgba(0,74,198,0.28)]
              active:scale-95
            "
            aria-label="Cari"
          >
            <Icon name="arrowRight" size={15} />
          </button>

          {suggestOpen && (
            <SearchSuggestions
              term={value}
              onPick={() => setSuggestOpen(false)}
            />
          )}
        </form>
      </div>
    </section>
  );
};

export default HomeSearch;