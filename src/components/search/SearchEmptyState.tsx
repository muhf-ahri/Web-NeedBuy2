import React from 'react';

import Icon, { type IconName } from '../ui/Icon';
import searchImg from '../../assets/Search.jpg';

interface SearchEmptyStateProps {
  variant: 'no-query' | 'no-products' | 'empty-store';
  query?: string;
  hasStores?: boolean;
  onAction?: () => void;
}

const CONFIG: Record<
  SearchEmptyStateProps['variant'],
  {
    eyebrow: string;
    title: string;
    tipsTitle: string;
    tips: string[];
    actionLabel: string;
    actionIcon: IconName;
    bottomText: string;
  }
> = {
  'no-query': {
    eyebrow: 'Mulai cari',
    title: 'Mau cari apa hari ini?',
    tipsTitle: 'Tips pencarian',
    tips: [
      'Pakai kata kunci spesifik, mis. "sepatu lari 42"',
      'Cari nama toko kalau langgananmu sudah jelas',
      'Gunakan sortir buat hasil yang lebih pas',
    ],
    actionLabel: 'Jelajahi Kategori',
    actionIcon: 'grid',
    bottomText: 'Ketik kata kunci — kami yang cariin',
  },
  'no-products': {
    eyebrow: 'Hasil kosong',
    title: 'Tidak ada produk yang cocok',
    tipsTitle: 'Coba cara ini',
    tips: [
      'Pakai kata kunci yang lebih umum',
      'Periksa ejaan kata kunci',
      'Gunakan sinonim, mis. "celana" → "chino"',
    ],
    actionLabel: 'Jelajahi Kategori',
    actionIcon: 'grid',
    bottomText: 'Jangan nyerah — coba kata kunci lain',
  },
  'empty-store': {
    eyebrow: 'Toko kosong',
    title: 'Toko ini belum ada produk',
    tipsTitle: 'Info toko',
    tips: [
      'Pemilik toko belum memajang produk apa pun',
      'Coba mampir lagi nanti ya',
      'Intip toko lain yang mirip di hasil pencarian',
    ],
    actionLabel: 'Kembali ke Pencarian',
    actionIcon: 'search',
    bottomText: 'Toko sedang menyiapkan produk',
  },
};

const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  variant,
  query,
  hasStores,
  onAction,
}) => {
  const config = CONFIG[variant];

  const subtitle =
    variant === 'no-query'
      ? 'Ketik kata kunci di kolom pencarian — produk atau toko — nanti kami bantu temukan yang paling pas.'
      : variant === 'no-products'
        ? hasStores
          ? `Tidak ada produk untuk "${query}". Tapi ada toko yang cocok — lihat di bagian Toko di atas.`
          : `Tidak ada produk untuk "${query}". Coba pakai kata kunci lain ya.`
        : 'Pemilik toko belum memajang produk apa pun. Coba lagi nanti ya.';

  return (
    <figure
      className="
        w-full overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)]
        backdrop-blur-sm
      "
    >
      {/* ── Mobile: gambar banner di atas ── */}
      <div className="relative h-44 md:hidden">
        <img
          src={searchImg}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />

        <div
          className="
            absolute left-4 top-4 inline-flex items-center gap-1.5
            rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
            uppercase tracking-[0.18em] text-[#538CDB] backdrop-blur-sm
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          Pencarian
        </div>

        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] text-white/90">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <span className="truncate">{config.bottomText}</span>
        </div>
      </div>

      {/* ── Desktop: konten KIRI, gambar KANAN ── */}
      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
        {/* Panel kiri: konten */}
        <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-lg">
            {/* Brand mobile */}
            <div className="mb-4 md:hidden">
              <p className="text-xs font-semibold text-[#538CDB]">Pencarian</p>
            </div>

            {/* Eyebrow */}
            <p
              className="
                mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]
                text-[#538CDB]
              "
            >
              {config.eyebrow}
            </p>

            <h3
              className="
                text-[22px] font-bold leading-tight tracking-tight
                text-[#20242D] sm:text-[26px]
              "
            >
              {config.title}
            </h3>

            <p className="mt-2 max-w-sm text-[13px] leading-5 text-[#737A87]">
              {subtitle}
            </p>

            {/* Box tips — pola box info di NeedPayNote */}
            <div className="mt-5 rounded-2xl bg-[#F5F7FB] px-5 py-4">
              <p
                className="
                  text-[10px] font-semibold uppercase tracking-[0.18em]
                  text-[#737A87]
                "
              >
                {config.tipsTitle}
              </p>

              <ul className="mt-3 space-y-2.5">
                {config.tips.map((tip, i) => (
                  <li key={tip} className="flex items-center gap-3">
                    <span
                      className="
                        flex h-7 w-7 shrink-0 items-center justify-center
                        rounded-full bg-white text-[10px] font-bold
                        text-[#538CDB] ring-1 ring-[#E8ECF4]
                      "
                    >
                      {i + 1}
                    </span>
                    <span className="text-[12px] font-medium text-[#20242D]">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA full-width */}
            {onAction && (
              <button
                type="button"
                onClick={onAction}
                className="
                  mt-5 inline-flex h-11 w-full items-center justify-center
                  gap-2 rounded-full bg-[#538CDB] px-6 text-sm font-semibold
                  text-white shadow-[0_7px_18px_rgba(83,140,219,0.20)]
                  transition-all duration-200 hover:bg-[#467BC7]
                  hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
                  active:scale-[0.99]
                "
              >
                <Icon name={config.actionIcon} size={16} className="text-white" />
                {config.actionLabel}
              </button>
            )}
          </div>
        </section>

        {/* Panel kanan: gambar + gelombang di tepi KIRI */}
        <section className="relative hidden min-h-[420px] overflow-hidden md:block">
          <img
            src={searchImg}
            alt="Bebek NeedBuy mencari produk"
            draggable={false}
            className="
              absolute inset-0 h-full w-full select-none object-cover
              transition-transform duration-700 hover:scale-[1.03]
            "
          />

          {/* Overlay gradasi bawah */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />

          {/* Gelombang putih di tepi kiri (di-mirror) */}
          <svg
            className="
              pointer-events-none absolute inset-y-0 left-0 h-full w-16
              -scale-x-100 md:w-20
            "
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M100 0
                 C 40 40, 90 90, 55 140
                 C 20 190, 70 230, 90 280
                 C 105 320, 50 360, 100 400
                 L 130 400 L 130 0 Z"
              fill="white"
            />
          </svg>

          {/* Label pill kanan atas */}
          <div
            className="
              absolute right-6 top-6 z-10 inline-flex items-center gap-1.5
              rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
              uppercase tracking-[0.18em] text-[#538CDB] backdrop-blur-sm
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
            Pencarian
          </div>

          {/* Dekorasi titik kuning */}
          <div
            className="
              pointer-events-none absolute left-[24%] top-[16%] z-10 h-1.5
              w-1.5 rounded-full bg-[#FFD500]
            "
          />

          {/* Text kanan bawah */}
          <div className="absolute bottom-5 right-6 z-10 text-right text-white">
            <p
              className="
                text-[10px] font-semibold uppercase tracking-[0.18em]
                text-white/70
              "
            >
              NeedBuy
            </p>
            <p className="mt-0.5 text-[11px] text-white/90">
              {config.bottomText}
            </p>
          </div>
        </section>
      </div>
    </figure>
  );
};

export default SearchEmptyState;