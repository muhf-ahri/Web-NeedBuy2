import React from 'react';

import Icon, { type IconName } from '../ui/Icon';
import kosongImg from '../../assets/Search.jpg';

type Variant = 'error' | 'empty' | 'no-match' | 'detail-empty';

interface CategoriesEmptyStateProps {
  variant: Variant;
  /** Override gambar kalau mau beda per halaman */
  image?: string;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onExplore?: () => void;
  onBack?: () => void;
}

const CONFIG: Record<
  Variant,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    tipsTitle: string;
    tips: string[];
    bottomText: string;
  }
> = {
  error: {
    eyebrow: 'Ups, ada masalah',
    title: 'Gagal memuat produk',
    subtitle:
      'Nggak bisa nyambung ke server. Pastiin server-nya nyala, terus coba lagi ya.',
    tipsTitle: 'Cek dulu ini',
    tips: [
      'Pastikan koneksi internetmu stabil',
      'Cek server backend sudah menyala',
      'Tekan "Coba Lagi" kalau sudah siap',
    ],
    bottomText: 'Jangan panik — coba lagi sebentar lagi',
  },
  empty: {
    eyebrow: 'Katalog kosong',
    title: 'Belum ada kategori',
    subtitle:
      'Kategori bakal muncul begitu ada produk yang dijual. Mampir lagi nanti ya.',
    tipsTitle: 'Info',
    tips: [
      'Kategori muncul setelah ada produknya',
      'Toko bisa menambahkan produk baru',
      'Mampir lagi nanti ya',
    ],
    bottomText: 'Katalog sedang diisi oleh para toko',
  },
  'no-match': {
    eyebrow: 'Hasil kosong',
    title: 'Tidak ada produk yang cocok',
    subtitle:
      'Filter kamu terlalu spesifik. Coba longgarkan beberapa filter biar hasilnya muncul.',
    tipsTitle: 'Coba cara ini',
    tips: [
      'Hapus beberapa filter kategori aktif',
      'Perlebar rentang harga min–maks',
      'Longgarkan filter kondisi barang',
    ],
    bottomText: 'Longgarkan filter, hasilnya bakal muncul',
  },
  'detail-empty': {
    eyebrow: 'Kategori kosong',
    title: 'Kategori ini masih kosong',
    subtitle:
      'Belum ada produk yang dijual di kategori ini. Cek kategori lain atau mampir lagi nanti.',
    tipsTitle: 'Info',
    tips: [
      'Toko belum menambah produk di sini',
      'Produk baru bisa muncul kapan saja',
      'Intip kategori lain yang lebih ramai',
    ],
    bottomText: 'Kategori ini menunggu produk pertama',
  },
};

const CategoriesEmptyState: React.FC<CategoriesEmptyStateProps> = ({
  variant,
  image = kosongImg,
  onRetry,
  onClearFilters,
  onExplore,
  onBack,
}) => {
  const config = CONFIG[variant];

  /* Pilih tombol sesuai variant */
  const primary =
    variant === 'error'
      ? { label: 'Coba Lagi', icon: 'arrowRight' as IconName, onClick: onRetry }
      : variant === 'no-match'
        ? { label: 'Hapus Semua Filter', icon: 'close' as IconName, onClick: onClearFilters }
        : variant === 'detail-empty'
          ? { label: 'Kembali ke Kategori', icon: 'arrowLeft' as IconName, onClick: onBack }
          : { label: 'Jelajahi Kategori', icon: 'grid' as IconName, onClick: onExplore };

  const secondary =
    variant === 'no-match'
      ? { label: 'Jelajahi Kategori', icon: 'grid' as IconName, onClick: onExplore }
      : variant === 'detail-empty'
        ? { label: 'Ke Beranda', icon: 'home' as IconName, onClick: onExplore }
        : undefined;

  return (
    <figure
      className="
        w-full overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm
      "
    >
      {/* ── Mobile: gambar banner di atas ── */}
      <div className="relative h-44 md:hidden">
        <img
          src={image}
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
          Kategori
        </div>
        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] text-white/90">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <span className="truncate">{config.bottomText}</span>
        </div>
      </div>

      {/* ── Desktop: konten KIRI, gambar KANAN ── */}
      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
        {/* Panel kiri */}
        <section className="flex items-center bg-white px-6 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-lg">
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
              {config.subtitle}
            </p>

            {/* Box tips */}
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

            {/* CTA */}
            <div className="mt-5 flex flex-wrap gap-2">
              {primary.onClick && (
                <button
                  type="button"
                  onClick={primary.onClick}
                  className="
                    inline-flex h-11 items-center justify-center gap-2
                    rounded-full bg-[#538CDB] px-6 text-sm font-semibold
                    text-white shadow-[0_7px_18px_rgba(83,140,219,0.20)]
                    transition-all duration-200 hover:bg-[#467BC7]
                    hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
                    active:scale-[0.99]
                  "
                >
                  <Icon name={primary.icon} size={15} className="text-white" />
                  {primary.label}
                </button>
              )}

              {secondary?.onClick && (
                <button
                  type="button"
                  onClick={secondary.onClick}
                  className="
                    inline-flex h-11 items-center justify-center gap-2
                    rounded-full border border-[#E8ECF4] bg-white px-6
                    text-sm font-semibold text-[#20242D] transition-all
                    duration-200 hover:border-[#538CDB] hover:text-[#538CDB]
                    active:scale-[0.99]
                  "
                >
                  <Icon name={secondary.icon} size={15} />
                  {secondary.label}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Panel kanan: gambar + gelombang kiri */}
        <section className="relative hidden min-h-[420px] overflow-hidden md:block">
          <img
            src={image}
            alt="Keranjang kosong"
            draggable={false}
            className="
              absolute inset-0 h-full w-full select-none object-cover
              transition-transform duration-700 hover:scale-[1.03]
            "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />

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
              d="M100 0 C 40 40, 90 90, 55 140 C 20 190, 70 230, 90 280 C 105 320, 50 360, 100 400 L 130 400 L 130 0 Z"
              fill="white"
            />
          </svg>

          <div
            className="
              absolute right-6 top-6 z-10 inline-flex items-center gap-1.5
              rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
              uppercase tracking-[0.18em] text-[#538CDB] backdrop-blur-sm
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
            Kategori
          </div>

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

export default CategoriesEmptyState;