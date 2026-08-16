import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Icon from '../ui/Icon';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import plansImg from '../../assets/Mohon.jpg';

/**
 * Halaman "belum login" untuk /plans — struktur card identik dengan
 * NeedPayNote / NeedsLoginPrompt: konten kiri, gambar kanan,
 * gelombang putih di tepi kiri panel gambar.
 */
const PlansLoginPrompt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F5F5FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="flex flex-1 items-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-4xl">
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
                src={plansImg}
                alt="Rencana belanja NeedBuy"
                draggable={false}
                className="
                  absolute inset-0 h-full w-full select-none object-cover
                "
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
                Rencana Belanja
              </div>

              <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] text-white/90">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                <span className="truncate">
                  Kelompokkan belanjaan, checkout sekaligus
                </span>
              </div>
            </div>

            {/* ── Desktop: konten KIRI, gambar KANAN ── */}
            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              {/* Panel kiri: konten login */}
              <section className="flex items-center bg-white px-6 py-8 sm:px-8 lg:px-10">
                <div className="mx-auto w-full max-w-md">
                  {/* Icon plan gradient */}
                  <h1 className="text-[30px] font-bold leading-tight tracking-tight text-[#538CBD] hover:text-[#467BC7] sm:text-[34px]">
                    Halaman Rencana
                  </h1>

                  {/* Eyebrow */}
                  <p
                    className="
                      mt-4 mb-2 text-[10px] font-semibold uppercase
                      tracking-[0.18em] text-[#538CDB]
                    "
                  >
                    Area member
                  </p>

                  <h2
                    className="
                      text-[22px] font-bold leading-tight tracking-tight
                      text-[#20242D] sm:text-[26px]
                    "
                  >
                    Login untuk Bikin Rencana
                  </h2>

                  <p className="mt-2 text-[13px] leading-5 text-[#737A87]">
                    Login dulu ya buat bikin dan mengelola kategori belanja
                    — mis. "Kamar" isi kipas & lampu — terus checkout
                    sekaligus tanpa ribet.
                  </p>

                  {/* CTA full-width */}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="
                      mt-5 inline-flex h-11 w-full items-center
                      justify-center gap-2 rounded-full bg-[#538CDB] px-6
                      text-sm font-semibold text-white
                      shadow-[0_7px_18px_rgba(83,140,219,0.20)]
                      transition-all duration-200 hover:bg-[#467BC7]
                      hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
                      active:scale-[0.99]
                    "
                  >
                    Login Sekarang
                    <Icon name="arrowRight" size={15} className="text-white" />
                  </button>

                  {/* Secondary: daftar */}
                  <p className="mt-3 text-center text-[12px] text-[#737A87]">
                    Belum punya akun?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-[#538CDB] hover:underline"
                    >
                      Daftar gratis
                    </Link>
                  </p>
                </div>
              </section>

              {/* Panel kanan: gambar + gelombang di tepi KIRI */}
              <section className="relative hidden min-h-[420px] overflow-hidden md:block">
                <img
                  src={plansImg}
                  alt="Bebek NeedBuy menyiapkan rencana belanja"
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
                    pointer-events-none absolute inset-y-0 left-0 h-full
                    w-16 -scale-x-100 md:w-20
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
                    absolute right-6 top-6 z-10 inline-flex items-center
                    gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px]
                    font-semibold uppercase tracking-[0.18em] text-[#538CDB]
                    backdrop-blur-sm
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                  Rencana Belanja
                </div>

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
                    Kelompokkan belanjaan, checkout sekaligus
                  </p>
                </div>
              </section>
            </div>
          </figure>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlansLoginPrompt;