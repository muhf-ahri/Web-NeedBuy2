import React from 'react';

import Icon from '../ui/Icon';
import catatanImg from '../../assets/Catatan.jpg';

interface NeedsEmptyStateProps {
  onWrite: () => void;
}

/**
 * Empty state halaman Kebutuhan — struktur card identik dengan
 * NeedPayNote, tapi TERBALIK: konten kiri, gambar kanan,
 * gelombang putih di tepi kiri panel gambar.
 */
const NeedsEmptyState: React.FC<NeedsEmptyStateProps> = ({ onWrite }) => (
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
        src={catatanImg}
        alt="Catatan kebutuhan"
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
        Kebutuhan
      </div>

      <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] text-white/90">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
        <span className="truncate">Ceritain kebutuhanmu — kami yang cariin</span>
      </div>
    </div>

    {/* ── Desktop: konten KIRI, gambar KANAN ── */}
    <div className="grid md:grid-cols-[1.1fr_0.9fr]">
      {/* Panel kiri: konten */}
      <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-lg">
          {/* Brand mobile */}
          <div className="mb-4 md:hidden">
            <p className="text-xs font-semibold text-[#538CDB]">Kebutuhan</p>
          </div>

          {/* Eyebrow */}
          <p
            className="
              mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]
              text-[#538CDB]
            "
          >
            Mulai dari sini
          </p>

          <h3
            className="
              text-[22px] font-bold leading-tight tracking-tight
              text-[#20242D] sm:text-[26px]
            "
          >
            Belum ada kebutuhan yang ditulis.
          </h3>

          <p className="mt-2 max-w-sm text-[13px] leading-5 text-[#737A87]">
            Tulis kebutuhanmu dalam kalimat bebas, nanti kami cariin produk
            yang paling pas buat kamu.
          </p>

          {/* Box "cara kerjanya" */}
          <div className="mt-5 rounded-2xl bg-[#F5F7FB] px-5 py-4">
            <p
              className="
                text-[10px] font-semibold uppercase tracking-[0.18em]
                text-[#737A87]
              "
            >
              Cara kerjanya
            </p>

            <ul className="mt-3 space-y-2.5">
              <li className="flex items-center gap-3">
                <span
                  className="
                    flex h-7 w-7 shrink-0 items-center justify-center
                    rounded-full bg-white text-[10px] font-bold
                    text-[#538CDB] ring-1 ring-[#E8ECF4]
                  "
                >
                  1
                </span>
                <span className="text-[12px] font-medium text-[#20242D]">
                  Tulis kebutuhanmu pakai kalimat sehari-hari
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="
                    flex h-7 w-7 shrink-0 items-center justify-center
                    rounded-full bg-white text-[10px] font-bold
                    text-[#538CDB] ring-1 ring-[#E8ECF4]
                  "
                >
                  2
                </span>
                <span className="text-[12px] font-medium text-[#20242D]">
                  AI menganalisis & mencocokkan dengan produk
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="
                    flex h-7 w-7 shrink-0 items-center justify-center
                    rounded-full bg-white text-[10px] font-bold
                    text-[#538CDB] ring-1 ring-[#E8ECF4]
                  "
                >
                  3
                </span>
                <span className="text-[12px] font-medium text-[#20242D]">
                  Lihat rekomendasi, pilih, dan checkout
                </span>
              </li>
            </ul>
          </div>

          {/* CTA full-width */}
          <button
            type="button"
            onClick={onWrite}
            className="
              mt-5 inline-flex h-11 w-full items-center justify-center
              gap-2 rounded-full bg-[#538CDB] px-6 text-sm font-semibold
              text-white shadow-[0_7px_18px_rgba(83,140,219,0.20)]
              transition-all duration-200 hover:bg-[#467BC7]
              hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
              active:scale-[0.99]
            "
          >
            <Icon name="spark" size={16} className="text-white" />
            Tulis Kebutuhan Pertama
          </button>
        </div>
      </section>

      {/* Panel kanan: gambar Catatan.jpg + gelombang di tepi KIRI */}
      <section className="relative hidden min-h-[420px] overflow-hidden md:block">
        <img
          src={catatanImg}
          alt="Catatan kebutuhan"
          draggable={false}
          className="
            absolute inset-0 h-full w-full select-none object-cover
            transition-transform duration-700 hover:scale-[1.03]
          "
        />

        {/* Overlay gradasi bawah */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />

        {/* ── Gelombang putih di tepi KIRI (di-mirror) ──
            Path sama persis dengan NeedPayNote, cuma dibalik
            horizontal pakai -scale-x-100 */}
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

        {/* Label pill — pindah ke kanan atas */}
        <div
          className="
            absolute right-6 top-6 z-10 inline-flex items-center gap-1.5
            rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
            uppercase tracking-[0.18em] text-[#538CDB] backdrop-blur-sm
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          Kebutuhan
        </div>

        {/* Text ringkas — pindah ke kanan bawah, rata kanan */}
        <div className="absolute bottom-5 right-6 z-10 text-right text-white">
          <p
            className="
              text-[10px] font-semibold uppercase tracking-[0.18em]
              text-white/70
            "
          >
            Belanja pintar
          </p>
          <p className="mt-0.5 text-[11px] text-white/90">
            Ceritain kebutuhanmu — kami yang cariin produknya
          </p>
        </div>
      </section>
    </div>
  </figure>
);

export default NeedsEmptyState;