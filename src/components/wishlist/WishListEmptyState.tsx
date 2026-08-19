import React from 'react';

import Icon from '../ui/Icon';
import kosongImg from '../../assets/Kosong.png';

interface WishlistEmptyStateProps {
  onExplore: () => void;
}

const WishlistEmptyState: React.FC<WishlistEmptyStateProps> = ({ onExplore }) => (
  <figure
    className="
      w-full overflow-hidden rounded-[24px] border border-white/80
      bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm
    "
  >
    
    <div className="relative h-44 md:hidden">
      <img
        src={kosongImg}
        alt="Wishlist kosong"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101319]/55 via-transparent to-transparent" />
      <div
        className="
          absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full
          bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase
          tracking-[0.18em] text-[#004ac6] backdrop-blur-sm
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
        Wishlist
      </div>
    </div>

    <div className="grid md:grid-cols-[1.1fr_0.9fr]">
      
      <section className="flex items-center bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-md">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#004ac6]">
            Wishlist kosong
          </p>

          <h3 className="text-[22px] font-bold leading-tight tracking-tight text-[#101319] sm:text-[26px]">
            Wishlist kamu masih kosong.
          </h3>

          <p className="mt-2 text-[13px] leading-5 text-[#737686]">
            Simpan produk yang kamu suka dengan menekan ikon hati, biar
            gampang ditemuin lagi nanti.
          </p>

          <div className="mt-5 rounded-2xl bg-[#F5F7FB] px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#737686]">
              Kenapa pakai wishlist?
            </p>
            <ul className="mt-3 space-y-2.5">
              {[
                'Tandai produk incaran tanpa langsung beli',
                'Bandingkan harga & stok kapan saja',
                'Checkout semuanya sekaligus saat gajian',
              ].map((tip, i) => (
                <li key={tip} className="flex items-center gap-3">
                  <span
                    className="
                      flex h-7 w-7 shrink-0 items-center justify-center
                      rounded-full bg-white text-[10px] font-bold
                      text-[#004ac6] ring-1 ring-[#e0e3e5]
                    "
                  >
                    {i + 1}
                  </span>
                  <span className="text-[12px] font-medium text-[#101319]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={onExplore}
            className="
              mt-5 inline-flex h-11 w-full items-center justify-center gap-2
              rounded-full bg-[#004ac6] px-6 text-sm font-semibold text-white
              shadow-[0_7px_18px_rgba(83,140,219,0.20)] transition-all
              duration-200 hover:bg-[#004ac6]
              hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)] active:scale-[0.99]
            "
          >
            <Icon name="grid" size={16} className="text-white" />
            Jelajahi Produk
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
            uppercase tracking-[0.18em] text-[#004ac6] backdrop-blur-sm
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          Wishlist
        </div>
        <div className="pointer-events-none absolute left-[24%] top-[16%] z-10 h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
        <div className="absolute bottom-5 right-6 z-10 text-right text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
            NeedBuy
          </p>
          <p className="mt-0.5 text-[11px] text-white/90">
            Keranjangmu nunggu diisi produk favorit
          </p>
        </div>
      </section>
    </div>
  </figure>
);

export default WishlistEmptyState;