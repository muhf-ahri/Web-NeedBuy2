import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Icon from '../ui/Icon';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import wishlistImg from '../../assets/Mohon.jpg';

const WishlistLoginPrompt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f7fb]"
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
            
            <div className="relative h-44 md:hidden">
              <img
                src={wishlistImg}
                alt="Wishlist NeedBuy"
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101319]/55 via-transparent to-transparent" />
              <div
                className="
                  absolute left-4 top-4 inline-flex items-center gap-1.5
                  rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
                  uppercase tracking-[0.18em] text-[#4077a6] backdrop-blur-sm
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                Suka
              </div>
              <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] text-white/90">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                <span className="truncate">Simpan favoritmu, checkout kapan aja</span>
              </div>
            </div>

            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              
              <section className="flex items-center bg-white px-6 py-8 sm:px-8 lg:px-10">
                <div className="mx-auto w-full max-w-md">
                  <h1 className="text-[30px] font-bold leading-tight tracking-tight text-[#4077a6] hover:text-[#4077a6] sm:text-[34px]">
                    Halaman Suka
                  </h1>

                  <p
                    className="
                      mt-4 mb-2 text-[10px] font-semibold uppercase
                      tracking-[0.18em] text-[#4077a6]
                    "
                  >
                    Area member
                  </p>

                  <h2
                    className="
                      text-[22px] font-bold leading-tight tracking-tight
                      text-[#101319] sm:text-[26px]
                    "
                  >
                    Login untuk Lihat Suka
                  </h2>

                  <p className="mt-2 text-[13px] leading-5 text-[#737686]">
                    Login dulu ya buat lihat produk yang kamu simpan dan
                    checkout semuanya kapan aja.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="
                      mt-5 inline-flex h-11 w-full items-center justify-center
                      gap-2 rounded-full bg-[#4077a6] px-6 text-sm font-semibold
                      text-white shadow-[0_7px_18px_rgba(83,140,219,0.20)]
                      transition-all duration-200 hover:bg-[#4077a6]
                      hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
                      active:scale-[0.99]
                    "
                  >
                    Login Sekarang
                    <Icon name="arrowRight" size={15} className="text-white" />
                  </button>

                  <p className="mt-3 text-center text-[12px] text-[#737686]">
                    Belum punya akun?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-[#4077a6] hover:underline"
                    >
                      Daftar gratis
                    </Link>
                  </p>
                </div>
              </section>

              <section className="relative hidden min-h-[420px] overflow-hidden md:block">
                <img
                  src={wishlistImg}
                  alt="Bebek NeedBuy menyimpan produk favorit"
                  draggable={false}
                  className="
                    absolute inset-0 h-full w-full select-none object-cover
                    transition-transform duration-700 hover:scale-[1.03]
                  "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101319]/55 via-transparent to-transparent" />

                <svg
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-16 -scale-x-100 md:w-20"
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
                    uppercase tracking-[0.18em] text-[#4077a6] backdrop-blur-sm
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                  Wishlist
                </div>

                <div className="absolute bottom-5 right-6 z-10 text-right text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    NeedBuy
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/90">
                    Simpan favoritmu, checkout kapan aja
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

export default WishlistLoginPrompt;