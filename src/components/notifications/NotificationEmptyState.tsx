import React from 'react';

import Icon from '../ui/Icon';
import notifImg from '../../assets/Crousel2.png';

interface NotificationsEmptyStateProps {
  variant: 'all-empty' | 'unread-empty';
  onExplore: () => void;
}

const NotificationsEmptyState: React.FC<NotificationsEmptyStateProps> = ({
  variant,
  onExplore,
}) => {
  const config =
    variant === 'unread-empty'
      ? {
          eyebrow: 'Semua terbaca',
          title: 'Tidak ada notifikasi baru.',
          subtitle:
            'Semua kabar sudah kamu baca. Yang baru akan muncul di sini begitu ada update.',
        }
      : {
          eyebrow: 'Belum ada kabar',
          title: 'Tidak ada notifikasi.',
          subtitle:
            'Notifikasi pesanan, pembayaran, dan stok akan muncul di sini. Sementara, yuk jelajahi produk!',
        };

  return (
    <figure
      className="
        w-full overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm
      "
    >
      {/* Mobile banner */}
      <div className="relative h-44 md:hidden">
        <img
          src={notifImg}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />
        <div
          className="
            absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full
            bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase
            tracking-[0.18em] text-[#538CDB] backdrop-blur-sm
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          Notifikasi
        </div>
      </div>

      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
        {/* Konten kiri */}
        <section className="flex items-center bg-white px-6 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-md">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#538CDB]">
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

            <p className="mt-2 text-[13px] leading-5 text-[#737A87]">
              {config.subtitle}
            </p>

            <button
              type="button"
              onClick={onExplore}
              className="
                mt-5 inline-flex h-11 items-center justify-center gap-2
                rounded-full bg-[#538CDB] px-6 text-sm font-semibold
                text-white shadow-[0_7px_18px_rgba(83,140,219,0.20)]
                transition-all duration-200 hover:bg-[#467BC7]
                hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)] active:scale-[0.99]
              "
            >
              <Icon name="grid" size={15} className="text-white" />
              Jelajahi Produk
            </button>
          </div>
        </section>

        {/* Gambar kanan */}
        <section className="relative hidden min-h-[420px] overflow-hidden md:block">
          <img
            src={notifImg}
            alt="Bebek NeedBuy menanti kabar"
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
            Notifikasi
          </div>

          <div className="pointer-events-none absolute left-[24%] top-[16%] z-10 h-1.5 w-1.5 rounded-full bg-[#FFD500]" />

          <div className="absolute bottom-5 right-6 z-10 text-right text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
              NeedBuy
            </p>
            <p className="mt-0.5 text-[11px] text-white/90">
              Kabarmu, tersaji di satu tempat
            </p>
          </div>
        </section>
      </div>
    </figure>
  );
};

export default NotificationsEmptyState;