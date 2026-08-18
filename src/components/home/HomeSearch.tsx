import React, { useEffect, useState } from 'react';

import Icon from '../ui/Icon';
import SearchSuggestions from '../ui/SearchSuggestions';

interface HomeSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  suggestOpen: boolean;
  setSuggestOpen: (open: boolean) => void;
  
  showSuggestions?: boolean;
}

const PLACEHOLDER_LINES = [
  'Contoh: laptop buat edit video, budget 15 juta...',
  'Contoh: sepatu lari untuk kaki lebar...',
  'Contoh: kopi robusta 1kg, harga di bawah 100rb...',
  'Contoh: kado wisuda buat sahabat cewek...',
  'Contoh: tas ransel tahan air untuk motoran...',
];

const INTERVAL_MS = 4000;

const HomeSearch: React.FC<HomeSearchProps> = ({
  value,
  onChange,
  onSubmit,
  suggestOpen,
  setSuggestOpen,
  showSuggestions = true,
}) => {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showAnimatedPlaceholder, setShowAnimatedPlaceholder] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_LINES.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setShowAnimatedPlaceholder(!value && !suggestOpen);
  }, [value, suggestOpen]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-7 sm:px-8">
      
      <div
        className="
          home-search-enter relative z-40 w-full overflow-visible
          rounded-[24px] border border-white/80 bg-white/95 p-5
          shadow-[0_18px_50px_rgba(32,36,45,0.08)] backdrop-blur-sm sm:p-6
        "
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p
              className="
                mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]
                text-[#538CDB]
              "
            >
              Cari produk
            </p>
            <h2
              className="
                text-[16px] font-bold leading-tight tracking-tight
                text-[#20242D] sm:text-[18px]
              "
            >
              Apa yang kamu cari hari ini?
            </h2>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="
            group/input relative flex items-center gap-2 rounded-full
            border border-[#E8ECF4] bg-[#F5F7FB] px-2 py-1.5
            transition-all duration-300 focus-within:border-[#538CDB]
            focus-within:bg-white focus-within:shadow-[0_6px_20px_rgba(83,140,219,0.12)]
          "
        >
          <span
            className="
              relative flex h-8 w-8 shrink-0 items-center justify-center
              rounded-full transition-colors duration-300
              group-focus-within/input:bg-[#538CDB]/10
            "
          >
            <Icon
              name="search"
              size={15}
              className="
                text-[#737A87] transition-colors duration-300
                group-focus-within/input:text-[#538CDB]
              "
            />
          </span>

          <div className="relative min-w-0 flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setSuggestOpen(true);
              }}
              onFocus={() => setSuggestOpen(true)}
              onBlur={() => {
                setTimeout(() => setSuggestOpen(false), 150);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSuggestOpen(false);
              }}
              placeholder={showAnimatedPlaceholder ? '' : 'Cari produk...'}
              className="
                min-w-0 w-full bg-transparent py-2 text-[13px]
                text-[#20242D] outline-none placeholder:text-[#A2A8B3]
              "
            />

            {showAnimatedPlaceholder && (
              <span
                aria-hidden="true"
                className="
                  pointer-events-none absolute inset-y-0 left-0 flex
                  items-center overflow-hidden
                "
              >
                <span
                  key={placeholderIdx}
                  className="
                    search-placeholder-in block truncate text-[13px]
                    text-[#A2A8B3]
                  "
                >
                  {PLACEHOLDER_LINES[placeholderIdx]}
                </span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full bg-[#538CDB] text-white
              shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
              duration-200 hover:bg-[#467BC7]
              hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
              active:scale-[0.95]
            "
            aria-label="Cari"
          >
            <Icon name="arrowRight" size={15} className="text-white" />
          </button>

          {showSuggestions && suggestOpen && (
            <SearchSuggestions
              term={value}
              onPick={() => setSuggestOpen(false)}
            />
          )}
        </form>

        {showAnimatedPlaceholder && (
          <div className="mt-3 flex justify-center gap-1.5">
            {PLACEHOLDER_LINES.map((line, i) => (
              <button
                key={line}
                type="button"
                onClick={() => setPlaceholderIdx(i)}
                aria-label={`Contoh ${i + 1}`}
                aria-current={i === placeholderIdx}
                className={`
                  h-1 rounded-full transition-all duration-300
                  ${
                    i === placeholderIdx
                      ? 'w-5 bg-[#538CDB]'
                      : 'w-1 bg-[#538CDB]/25 hover:bg-[#538CDB]/50'
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes home-search-enter {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .home-search-enter {
          animation: home-search-enter 0.6s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }

        @keyframes search-placeholder-in {
          0%   { opacity: 0; transform: translateY(70%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .search-placeholder-in {
          animation: search-placeholder-in 0.5s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>
    </section>
  );
};

export default HomeSearch;