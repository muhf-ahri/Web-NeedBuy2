import React from 'react';

import Icon from '../ui/Icon';
import kosongImg from '../../assets/Kosong.png';

interface CartEmptyStateProps {
  onShop: () => void;
}

const CartEmptyState: React.FC<CartEmptyStateProps> = ({ onShop }) => (
  <figure
    className="
      w-full overflow-hidden rounded-[24px] border border-white/80
      bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm
    "
  >
    
    <div className="relative h-44 md:hidden">
      <img
        src={kosongImg}
        alt="Keranjang kosong"
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
        Keranjang
      </div>
    </div>

    <div className="grid md:grid-cols-[1.1fr_0.9fr]">
      
      <section className="flex items-center bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-md">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#538CDB]">
            Keranjang kosong
          </p>

          <h3 className="text-[22px] font-bold leading-tight tracking-tight text-[#20242D] sm:text-[26px]">
            Keranjangmu masih kosong.
          </h3>

          <p className="mt-2 text-[13px] leading-5 text-[#737A87]">
            Barang yang kamu tambahin bakal muncul di sini, siap
            dicheckout kapan aja.
          </p>

          <div className="mt-5 rounded-2xl bg-[#F5F7FB] px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#737A87]">
              Tips belanja
            </p>
            <ul className="mt-3 space-y-2.5">
              {[
                'Tambahkan produk lewat tombol keranjang',
                'Centang item yang mau dibayar sekarang',
                'Atur budget biar belanja tetap terarah',
              ].map((tip, i) => (
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
                  <span className="text-[12px] font-medium text-[#20242D]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={onShop}
            className="
              mt-5 inline-flex h-11 w-full items-center justify-center gap-2
              rounded-full bg-[#538CDB] px-6 text-sm font-semibold text-white
              shadow-[0_7px_18px_rgba(83,140,219,0.20)] transition-all
              duration-200 hover:bg-[#467BC7]
              hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)] active:scale-[0.99]
            "
          >
            <Icon name="grid" size={16} className="text-white" />
            Mulai Belanja
          </button>
        </div>
      </section>

      <section className="relative hidden min-h-[420px] overflow-hidden md:block">
        <img
          src={kosongImg}
          alt="Bebek dengan keranjang kosong"
          draggable={false}
          className="
            absolute inset-0 h-full w-full select-none object-cover
            transition-transform duration-700 hover:scale-[1.03]
          "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />
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
            uppercase tracking-[0.18em] text-[#538CDB] backdrop-blur-sm
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          Keranjang
        </div>
        <div className="pointer-events-none absolute left-[24%] top-[16%] z-10 h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
        <div className="absolute bottom-5 right-6 z-10 text-right text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
            NeedBuy
          </p>
          <p className="mt-0.5 text-[11px] text-white/90">
            Isi keranjangmu, checkout tinggal satu ketukan
          </p>
        </div>
      </section>
    </div>
  </figure>
);

export default CartEmptyState;