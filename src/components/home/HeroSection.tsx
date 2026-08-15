// src/components/home/HeroSection.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../ui/Icon';
import heroImg from '../../assets/HeroSection.jpg';

/* ── Slogan e-commerce: simple, catchy, sesuai voice NeedBuy ── */
const ROTATING_LINES = [
  'dompet tetap aman.',
  'hidup lebih ringan.',
  'tanpa drama checkout.',
  'sesuai kebutuhanmu.',
  'harga selalu jujur.',
];

const INTERVAL_MS = 3200;

const HeroSection: React.FC<{
  /** Pakai `flip` kalau mau bebek di kiri & card di kanan */
  flip?: boolean;
}> = ({ flip = false }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  /* Ganti slogan otomatis (hormati prefers-reduced-motion) */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % ROTATING_LINES.length),
      INTERVAL_MS
    );

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-8 sm:pt-7">
      <div
        className="
          relative overflow-hidden rounded-[24px] border border-white/80
          shadow-[0_18px_50px_rgba(32,36,45,0.10)]
        "
      >
        {/* ── Ilustrasi 3 bebek — tidak ditutup card ── */}
        <img
          src={heroImg}
          alt="Tiga bebek NeedBuy"
          draggable={false}
          className={`
            absolute inset-0 h-full w-full select-none object-cover
            ${flip ? '-scale-x-100 object-left' : 'object-right'}
          `}
        />

        {/* Overlay lembut HANYA sisi card — fade sebelum menyentuh bebek */}
        <div
          className={`
            absolute inset-0
            ${flip ? 'bg-gradient-to-l' : 'bg-gradient-to-r'}
          `}
        />

        {/* ── Card hero (chrome sama seperti card Login) ── */}
        <div
          className={`
            relative z-10 flex min-h-[420px] items-center px-4 py-8
            sm:min-h-[460px] sm:px-8 lg:px-10
          `}
        >
          <div
            className={`
              relative w-full max-w-md overflow-hidden rounded-[24px]
              border border-white/80 bg-white/95
              shadow-[0_18px_50px_rgba(32,36,45,0.12)] backdrop-blur-sm
              ${flip ? 'ml-auto' : ''}
            `}
          >
            {/* Strip gelombang gradient di tepi kiri — signature tema NeedBuy */}
            <svg
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-6 sm:w-7"
              viewBox="0 0 40 400"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="hero-strip"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="400"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5B93E0" />
                  <stop offset="1" stopColor="#3A66AC" />
                </linearGradient>
              </defs>
              <path
                d="M0 0h20c12 60-12 120 0 200 12 80-12 140 0 200H0V0Z"
                fill="url(#hero-strip)"
              />
            </svg>

            {/* Dekorasi halus sudut kanan atas */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#538CDB]/10" />
            <div className="pointer-events-none absolute right-6 top-6 h-1.5 w-1.5 rounded-full bg-[#FFD500]" />

            {/* Konten card */}
            <div className="relative z-10 px-6 py-7 pl-9 sm:px-8 sm:pl-10">
              {/* Brand row */}
              <div className="flex items-center gap-2">
                <span
                  className="
                    relative flex h-8 w-8 items-center justify-center
                    overflow-hidden rounded-lg bg-gradient-to-br
                    from-[#5B93E0] to-[#3A66AC] text-[11px] font-bold
                    text-white shadow-[0_4px_12px_rgba(83,140,219,0.25)]
                  "
                >
                  <span className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white/25" />
                  N
                </span>
                <span
                  className="text-[15px] font-bold tracking-tight text-[#20242D]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  NeedBuy
                </span>
              </div>

              {/* Eyebrow */}
              <p
                className="
                  mt-4 text-[10px] font-semibold uppercase tracking-[0.18em]
                  text-[#538CDB]
                "
              >
                Selamat datang di NeedBuy
              </p>

              {/* Judul + slogan berganti */}
              <h1
                className="
                  mt-2 text-[24px] font-extrabold leading-[1.2]
                  tracking-tight text-[#20242D] sm:text-[27px]
                "
              >
                Belanja cerdas,
                {/* tinggi dikunci biar layout tidak lompat */}
                <span className="block h-[1.35em] overflow-hidden">
                  <span key={index} className="hero-slogan-in block">
                    <span className="relative inline-block text-[#538CDB]">
                      {ROTATING_LINES[index]}
                      {/* Highlight kuning — callback ke angka 0 di 404 */}
                      <span
                        aria-hidden="true"
                        className="
                          absolute -bottom-1 left-0 right-0 h-1.5
                        "
                      />
                    </span>
                  </span>
                </span>
              </h1>

              {/* Deskripsi */}
              <p
                className="
                  mt-2 text-[12px] leading-relaxed text-[#737A87] sm:text-[13px]
                "
              >
                NeedBuy bantu kamu belanja sesuai kebutuhan — terarah, hemat,
                dan tanpa penyesalan di akhir bulan.
              </p>

              {/* CTA — pola tombol form Login */}
              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/categories')}
                  className="
                    flex h-11 w-full items-center justify-center gap-2
                    rounded-full bg-[#538CDB] px-6 text-sm font-semibold
                    text-white shadow-[0_7px_18px_rgba(83,140,219,0.20)]
                    transition-all duration-200 hover:bg-[#467BC7]
                    hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
                    active:scale-[0.99]
                  "
                >
                  Mulai Belanja
                  <Icon name="arrowRight" size={15} className="text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/coupons')}
                  className="
                    flex h-11 w-full items-center justify-center rounded-full
                    border border-[#D8DEE9] bg-white px-6 text-sm
                    font-semibold text-[#2F5AA0] shadow-sm transition-all
                    duration-200 hover:border-[#538CDB] hover:bg-[#F5F7FB]
                    hover:text-[#1E4080] active:scale-[0.99]
                  "
                >
                  Lihat Promo
                </button>
              </div>

              {/* Indicator slogan — bisa diklik */}
              <div className="mt-5 flex justify-center gap-1.5">
                {ROTATING_LINES.map((line, i) => (
                  <button
                    key={line}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Slogan ${i + 1}`}
                    aria-current={i === index}
                    className={`
                      h-1.5 rounded-full transition-all duration-300
                      ${
                        i === index
                          ? 'w-7 bg-[#538CDB]'
                          : 'w-1.5 bg-[#538CDB]/25 hover:bg-[#538CDB]/50'
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes animasi slogan (slide-up + fade) */}
      <style>{`
        @keyframes hero-slogan-in {
          0%   { opacity: 0; transform: translateY(70%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .hero-slogan-in {
          animation: hero-slogan-in 0.55s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;