// src/components/layout/PromoCarousel.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon, { type IconName } from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { Product } from '../../types';

const strikePrice = (price: string, discountPercent: number): number =>
  Math.round(Number(price) / (1 - discountPercent / 100));

type AppPromo = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  icon: IconName;
  accent: string;
};

const APP_PROMOS: AppPromo[] = [
  {
    eyebrow: 'NeedPay',
    title: 'Isi saldo sekali, checkout tinggal satu ketukan',
    body: 'Saldo NeedPay bisa langsung dipakai saat checkout tanpa perlu berpindah aplikasi.',
    cta: 'Isi saldo NeedPay',
    to: '/needpay',
    icon: 'wallet',
    accent: '#2563C7',
  },
  {
    eyebrow: 'Cara belanja di NeedBuy',
    title: 'Tulis kebutuhanmu, kami yang nyariin',
    body: 'Tulis apa yang kamu butuhkan dan temukan produk yang paling sesuai dengan kebutuhanmu.',
    cta: 'Coba tulis kebutuhan',
    to: '/needs',
    icon: 'spark',
    accent: '#2563C7',
  },
  {
    eyebrow: 'Rencana belanja',
    title: 'Belanja banyak, budget tetap kepegang',
    body: 'Susun daftar belanja dan pantau total pengeluaran sebelum kamu checkout.',
    cta: 'Bikin rencana belanja',
    to: '/plans',
    icon: 'plan',
    accent: '#2563C7',
  },
  {
    eyebrow: 'Kupon',
    title: 'Klaim kupon dulu, baru checkout',
    body: 'Temukan berbagai kupon dan manfaatkan potongan harga untuk belanja lebih hemat.',
    cta: 'Lihat kupon',
    to: '/coupons',
    icon: 'coupon',
    accent: '#2563C7',
  },
];

const SLIDE_MS = 6000;

const DecorativeShapes: React.FC = () => (
  <>
    <div
      aria-hidden="true"
      className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#FFD500]"
    />
    <div
      aria-hidden="true"
      className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-[#FF4B4B]"
    />
    <div
      aria-hidden="true"
      className="absolute right-[28%] bottom-[12%] h-10 w-10 rounded-full bg-[#6FA4EA]/50"
    />
    <div
      aria-hidden="true"
      className="absolute left-[8%] top-[18%] h-3 w-3 rounded-full bg-[#FFD500]"
    />
    <div
      aria-hidden="true"
      className="absolute right-[12%] bottom-[22%] h-4 w-4 rotate-45 rounded-[3px] bg-[#FF4B4B]"
    />
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-40"
      viewBox="0 0 400 300"
      fill="none"
    >
      <path
        d="M420 20C320 50 360 110 280 130C210 148 270 210 170 245"
        stroke="#2563C7"
        strokeWidth="1.2"
      />
      <path
        d="M430 45C340 72 375 125 295 150C230 170 285 225 185 270"
        stroke="#2563C7"
        strokeWidth="0.8"
        opacity="0.45"
      />
    </svg>
  </>
);

const SaleSlide: React.FC<{ product: Product }> = ({ product }) => {
  const image = product.images?.[0]?.url;

  return (
    <div className="h-full w-full snap-center shrink-0">
      <Link
        to={`/products/${product.slug}`}
        className="
          group relative flex h-full min-h-[230px] sm:min-h-[250px]
          overflow-hidden rounded-[22px]
          border border-[#DCE7F8]
          bg-[#EAF2FF]
          text-[#172033]
          shadow-[0_8px_30px_rgba(37,99,199,0.08)]
          transition-all duration-300
          hover:shadow-[0_14px_40px_rgba(37,99,199,0.14)]
        "
      >
        <DecorativeShapes />
        <div className="relative z-10 flex flex-1 flex-col justify-center p-5 sm:p-7 lg:p-8">
          <span
            className="
              inline-flex w-fit items-center gap-1.5
              rounded-full bg-[#FF4B4B]
              px-2.5 py-1
              text-[10px] font-bold uppercase tracking-wider text-white
            "
          >
            <Icon name="tag" size={11} className="text-white" />
            Diskon {product.discountPercent}%
          </span>

          <h3
            className="
              mt-3 max-w-[520px]
              line-clamp-2
              text-[21px] font-bold leading-[1.12]
              text-[#172033]
              sm:text-[27px]
            "
          >
            {product.name}
          </h3>

          <p className="mt-1 text-[12px] font-medium text-[#65738B]">
            {product.category?.name}
          </p>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-xl font-extrabold text-[#2563C7] sm:text-2xl">
              {formatRupiah(product.price)}
            </span>

            <span className="text-xs text-[#8793A6] line-through">
              {formatRupiah(
                strikePrice(product.price, product.discountPercent)
              )}
            </span>
          </div>

          <span
            className="
              mt-4 inline-flex w-fit items-center gap-2
              rounded-full
              bg-[#2563C7]
              px-4 py-2
              text-[12px] font-bold text-white
              transition-all duration-200
              group-hover:gap-3
              group-hover:bg-[#1D4FA5]
            "
          >
            Ambil sekarang
            <Icon name="arrowRight" size={15} className="text-white" />
          </span>
        </div>
        <div
          className="
            relative z-10
            hidden w-[36%]
            shrink-0
            items-center justify-center
            overflow-hidden
            bg-white/70
            sm:flex
          "
        >
          {image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              className="
                h-full w-full object-cover
                transition-transform duration-500
                group-hover:scale-[1.04]
              "
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <Icon name="orders" size={40} className="text-[#2563C7]/40" />
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

const AppSlide: React.FC<{ promo: AppPromo }> = ({ promo }) => (
  <div className="h-full w-full snap-center shrink-0">
    <div
      className="
        relative flex h-full min-h-[230px] sm:min-h-[250px]
        overflow-hidden rounded-[22px]
        border border-[#DCE7F8]
        bg-[#EAF2FF]
        p-5 sm:p-7 lg:p-8
        text-[#172033]
        shadow-[0_8px_30px_rgba(37,99,199,0.08)]
      "
    >
      <DecorativeShapes />

      {/* Main blue shape */}
      <div
        aria-hidden="true"
        className="
          absolute
          -right-24
          bottom-[-90px]
          h-64
          w-64
          rounded-full
          bg-[#2563C7]/10
        "
      />

      {/* Content */}
      <div className="relative z-10 flex h-full max-w-2xl flex-col justify-between">
        <div>
          <p
            className="
              inline-flex w-fit items-center gap-1.5
              rounded-full
              bg-white
              px-2.5 py-1
              text-[10px] font-bold uppercase
              tracking-wider
              text-[#2563C7]
              shadow-sm
            "
          >
            <Icon name={promo.icon} size={11} className="text-[#2563C7]" />
            {promo.eyebrow}
          </p>

          <h3
            className="
              mt-3 max-w-xl
              text-[22px] font-extrabold
              leading-[1.1]
              text-[#172033]
              sm:text-[28px]
            "
          >
            {promo.title}
          </h3>

          <p
            className="
              mt-2 max-w-lg
              text-[12px]
              leading-relaxed
              text-[#65738B]
              sm:text-[13px]
            "
          >
            {promo.body}
          </p>
        </div>

        <Link
          to={promo.to}
          className="
            mt-4 inline-flex w-fit items-center gap-2
            rounded-full
            bg-[#2563C7]
            px-4 py-2
            text-[12px] font-bold
            text-white
            transition-all duration-200
            hover:bg-[#1D4FA5]
            hover:gap-3
          "
          style={{ color: '#ffffff' }}
        >
          {promo.cta}
          <Icon name="arrowRight" size={15} className="text-white" />
        </Link>
      </div>

      {/* Decorative card */}
      <div
        aria-hidden="true"
        className="
          absolute right-[12%] top-[20%]
          hidden h-24 w-24
          rotate-12
          rounded-[20px]
          border-2 border-white
          bg-[#2563C7]
          shadow-lg
          lg:block
        "
      >
        <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-[#FFD500]" />
        <div className="absolute bottom-4 right-4 h-3 w-3 rounded-full bg-[#FF4B4B]" />
      </div>
    </div>
  </div>
);

/* =========================================================
   Main Carousel
========================================================= */

const DEFAULT_SHELL = 'mx-auto w-full max-w-6xl px-5 sm:px-10 pt-5';

const PromoCarousel: React.FC<{
  saleProducts: Product[];
  loading?: boolean;
  className?: string;
}> = ({
  saleProducts,
  loading = false,
  className = DEFAULT_SHELL,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const hasSales = saleProducts.length > 0;

  const slides: Array<{
    key: string;
    node: React.ReactNode;
  }> = [
    ...(hasSales
      ? saleProducts.slice(0, 3).map((product) => ({
          key: `sale-${product.id}`,
          node: <SaleSlide product={product} />,
        }))
      : []),

    ...APP_PROMOS.map((promo) => ({
      key: promo.to,
      node: <AppSlide promo={promo} />,
    })),
  ];

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;

      if (!track) return;

      const clamped =
        (index + slides.length) % slides.length;

      track.scrollTo({
        left: track.clientWidth * clamped,
        behavior: 'smooth',
      });
    },
    [slides.length]
  );

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track || track.clientWidth === 0) return;

    setActive(
      Math.round(track.scrollLeft / track.clientWidth)
    );
  };

  /* Autoplay */
  useEffect(() => {
    if (paused || slides.length < 2) return;

    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      const track = trackRef.current;

      if (!track || track.clientWidth === 0) return;

      const next =
        (Math.round(track.scrollLeft / track.clientWidth) + 1) %
        slides.length;

      track.scrollTo({
        left: track.clientWidth * next,
        behavior: 'smooth',
      });
    }, SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (loading) {
    return (
      <section className={className}>
        <div
          className="
            h-[230px] sm:h-[250px]
            animate-pulse
            rounded-[22px]
            bg-[#EAF2FF]
          "
        />
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section
      className={className}
      aria-label="Promo dan info NeedBuy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative">
        {/* Track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          tabIndex={0}
          className="
            flex
            snap-x snap-mandatory
            gap-4
            overflow-x-auto
            scroll-smooth
            rounded-[22px]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-[#2563C7]
          "
        >
          {slides.map(({ key, node }) => (
            <div
              key={key}
              className="min-w-full"
            >
              {node}
            </div>
          ))}
        </div>

        {/* Previous */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Promo sebelumnya"
              className="
                absolute -left-4 top-1/2
                hidden h-9 w-9
                -translate-y-1/2
                items-center justify-center
                rounded-full
                border border-[#DCE7F8]
                bg-white
                text-[#2563C7]
                shadow-md
                transition-all
                hover:bg-[#EEF5FF]
                hover:shadow-lg
                sm:flex
              "
            >
              <Icon name="chevronLeft" size={17} />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Promo berikutnya"
              className="
                absolute -right-4 top-1/2
                hidden h-9 w-9
                -translate-y-1/2
                items-center justify-center
                rounded-full
                border border-[#DCE7F8]
                bg-white
                text-[#2563C7]
                shadow-md
                transition-all
                hover:bg-[#EEF5FF]
                hover:shadow-lg
                sm:flex
              "
            >
              <Icon name="chevronRight" size={17} />
            </button>
          </>
        )}
      </div>

      {/* Indicator */}
      {slides.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map(({ key }, index) => (
            <button
              key={key}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ke promo ${index + 1}`}
              aria-current={index === active}
              className={`
                h-1.5 rounded-full
                transition-all duration-300
                ${
                  index === active
                    ? 'w-6 bg-[#2563C7]'
                    : 'w-1.5 bg-[#C9D7EC] hover:bg-[#8FAED8]'
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PromoCarousel;