import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Icon, { type IconName } from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { Product } from '../../types';

/* ── Ilustrasi carousel dari src/assets ──
   Catatan: sesuai screenshot, Crousel1 berekstensi .jpg —
   kalau di proyek kamu ternyata .png, tinggal ganti extension-nya. */
import crousel1 from '../../assets/Crousel1.png';
import crousel2 from '../../assets/Crousel2.png';
import crousel3 from '../../assets/Crousel3.png';
import crousel4 from '../../assets/Crousel4.png';

const strikePrice = (price: string, discountPercent: number): number =>
  Math.round(Number(price) / (1 - discountPercent / 100));

type AppPromo = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  icon: IconName;
  illustration: string;
};

const APP_PROMOS: AppPromo[] = [
  {
    eyebrow: 'NeedPay',
    title: 'Isi saldo sekali, checkout tinggal satu ketukan',
    body: 'Saldo NeedPay bisa langsung dipakai saat checkout tanpa perlu berpindah aplikasi.',
    cta: 'Isi saldo NeedPay',
    to: '/needpay',
    icon: 'wallet',
    illustration: crousel1,
  },
  {
    eyebrow: 'Cara belanja di NeedBuy',
    title: 'Tulis kebutuhanmu, kami yang nyariin',
    body: 'Tulis apa yang kamu butuhkan dan temukan produk yang paling sesuai dengan kebutuhanmu.',
    cta: 'Coba tulis kebutuhan',
    to: '/needs',
    icon: 'spark',
    illustration: crousel2,
  },
  {
    eyebrow: 'Rencana belanja',
    title: 'Belanja banyak, budget tetap kepegang',
    body: 'Susun daftar belanja dan pantau total pengeluaran sebelum kamu checkout.',
    cta: 'Bikin rencana belanja',
    to: '/plans',
    icon: 'plan',
    illustration: crousel3,
  },
  {
    eyebrow: 'Kupon',
    title: 'Klaim kupon dulu, baru checkout',
    body: 'Temukan berbagai kupon dan manfaatkan potongan harga untuk belanja lebih hemat.',
    cta: 'Lihat kupon',
    to: '/coupons',
    icon: 'coupon',
    illustration: crousel4,
  },
];

const SLIDE_MS = 6000;

/* =============================================================
   PANEL KIRI — card gambar ilustrasi (pola panel Login)
============================================================= */
const IllustrationPanel: React.FC<{
  icon: IconName;
  image?: string;
  alt?: string;
}> = ({ icon, image, alt = '' }) => (
  <section
    className="
      relative hidden overflow-hidden bg-gradient-to-br from-[#538CDB]
      via-[#4A7ECB] to-[#3A66AC] md:flex
    "
  >
    {/* Tepi gelombang (sama seperti panel branding Login) */}
    <svg
      className="pointer-events-none absolute inset-y-0 right-0 h-full w-16 md:w-20"
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

    {/* Dekorasi minimalis */}
    <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border border-white/15" />
    <div className="pointer-events-none absolute bottom-6 left-10 h-24 w-24 rounded-full border border-white/10" />
    <div className="pointer-events-none absolute right-[24%] top-[16%] h-1.5 w-1.5 rounded-full bg-[#FFD500]" />

    {/* Card gambar ilustrasi */}
    <div className="relative z-10 flex h-full w-full items-center justify-center p-7">
      {image ? (
        <div
          className="
            w-full max-w-[280px] overflow-hidden rounded-2xl bg-white
            shadow-[0_18px_40px_rgba(20,30,50,0.25)] ring-1 ring-white/40
          "
        >
          <img
            src={image}
            alt={alt}
            loading="lazy"
            draggable={false}
            className="aspect-[4/3] h-full w-full select-none object-cover"
          />
        </div>
      ) : (
        /* Fallback kalau tidak ada gambar: icon besar */
        <div
          className="
            flex h-24 w-24 items-center justify-center rounded-2xl
            bg-white/15 ring-1 ring-white/25 backdrop-blur-sm
          "
        >
          <Icon name={icon} size={44} className="text-white" />
        </div>
      )}
    </div>
  </section>
);

/* =============================================================
   SALE SLIDE — produk diskon
============================================================= */
const SaleSlide: React.FC<{ product: Product }> = ({ product }) => {
  const image = product.images?.[0]?.url;

  return (
    <div className="h-full w-full snap-center shrink-0">
      <div
        className="
          overflow-hidden rounded-[24px] border border-white/80 bg-white/95
          shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm
        "
      >
        <div className="grid min-h-[260px] md:grid-cols-[0.85fr_1.15fr]">
          <IllustrationPanel
            icon="tag"
            image={image}
            alt={product.name}
          />

          <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
            <div className="mx-auto w-full max-w-md">
              <span
                className="
                  inline-flex items-center gap-1.5 rounded-full bg-[#FFF0F0]
                  px-3 py-1 text-[10px] font-semibold uppercase
                  tracking-[0.18em] text-[#FF4646]
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF4646]" />
                Diskon {product.discountPercent}%
              </span>

              <h3
                className="
                  mt-3 text-[22px] font-bold leading-tight tracking-tight
                  text-[#20242D] sm:text-[26px]
                "
              >
                {product.name}
              </h3>

              <p className="mt-1 text-[12px] font-medium text-[#737A87]">
                {product.category?.name}
              </p>

              <div className="mt-4 flex items-baseline gap-2.5">
                <span className="text-2xl font-extrabold text-[#538CDB]">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-xs text-[#A2A8B3] line-through">
                  {formatRupiah(
                    strikePrice(product.price, product.discountPercent)
                  )}
                </span>
              </div>

              <Link
                to={`/products/${product.slug}`}
                className="
                  mt-5 inline-flex items-center gap-2 rounded-full bg-[#538CDB]
                  px-5 py-2.5 text-[12px] font-semibold text-white
                  shadow-[0_7px_18px_rgba(83,140,219,0.20)] transition-all
                  duration-200 hover:gap-3 hover:bg-[#467BC7]
                  hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
                  active:scale-[0.99]
                "
              >
                Ambil sekarang
                <Icon name="arrowRight" size={15} className="text-white" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* =============================================================
   APP SLIDE — promo fitur (pakai Crousel1–4)
============================================================= */
const AppSlide: React.FC<{ promo: AppPromo }> = ({ promo }) => (
  <div className="h-full w-full snap-center shrink-0">
    <div
      className="
        overflow-hidden rounded-[24px] border border-white/80 bg-white/95
        shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm
      "
    >
      <div className="grid min-h-[260px] md:grid-cols-[0.85fr_1.15fr]">
        <IllustrationPanel
          icon={promo.icon}
          image={promo.illustration}
          alt={promo.eyebrow}
        />

        <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-md">
            <p
              className="
                mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]
                text-[#538CDB]
              "
            >
              {promo.eyebrow}
            </p>

            <h3
              className="
                text-[22px] font-bold leading-tight tracking-tight
                text-[#20242D] sm:text-[26px]
              "
            >
              {promo.title}
            </h3>

            <p className="mt-2 max-w-sm text-[13px] leading-5 text-[#737A87]">
              {promo.body}
            </p>

            <Link
              to={promo.to}
              className="
                mt-5 inline-flex items-center gap-2 rounded-full bg-[#538CDB]
                px-5 py-2.5 text-[12px] font-semibold text-white
                shadow-[0_7px_18px_rgba(83,140,219,0.20)] transition-all
                duration-200 hover:gap-3 hover:bg-[#467BC7]
                hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
                active:scale-[0.99]
              "
            >
              {promo.cta}
              <Icon name="arrowRight" size={15} className="text-white" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  </div>
);

/* =============================================================
   MAIN CAROUSEL
============================================================= */
const DEFAULT_SHELL = 'mx-auto w-full max-w-6xl px-5 sm:px-10 pt-5';

const PromoCarousel: React.FC<{
  saleProducts: Product[];
  loading?: boolean;
  className?: string;
}> = ({ saleProducts, loading = false, className = DEFAULT_SHELL }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const hasSales = saleProducts.length > 0;

  const slides: Array<{ key: string; node: React.ReactNode }> = [
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

      const clamped = (index + slides.length) % slides.length;
      track.scrollTo({ left: track.clientWidth * clamped, behavior: 'smooth' });
    },
    [slides.length]
  );

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track || track.clientWidth === 0) return;

      const next =
        (Math.round(track.scrollLeft / track.clientWidth) + 1) % slides.length;

      track.scrollTo({ left: track.clientWidth * next, behavior: 'smooth' });
    }, SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (loading) {
    return (
      <section className={className}>
        <div
          className="
            h-[260px] animate-pulse rounded-[24px] bg-white/95
            shadow-[0_18px_50px_rgba(32,36,45,0.10)]
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
        <div
          ref={trackRef}
          onScroll={handleScroll}
          tabIndex={0}
          className="
            flex snap-x snap-mandatory overflow-x-auto scroll-smooth
            rounded-[24px] [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-[#538CDB]
          "
        >
          {slides.map(({ key, node }) => (
            <div key={key} className="min-w-full px-1">
              {node}
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Promo sebelumnya"
              className="
                absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2
                items-center justify-center rounded-full border border-white/80
                bg-white/95 text-[#538CDB] shadow-[0_8px_24px_rgba(32,36,45,0.12)]
                backdrop-blur-sm transition-all hover:bg-[#F5F5FF]
                hover:shadow-[0_10px_28px_rgba(32,36,45,0.15)] sm:flex
              "
            >
              <Icon name="chevronLeft" size={18} />
            </button>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Promo berikutnya"
              className="
                absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2
                items-center justify-center rounded-full border border-white/80
                bg-white/95 text-[#538CDB] shadow-[0_8px_24px_rgba(32,36,45,0.12)]
                backdrop-blur-sm transition-all hover:bg-[#F5F5FF]
                hover:shadow-[0_10px_28px_rgba(32,36,45,0.15)] sm:flex
              "
            >
              <Icon name="chevronRight" size={18} />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {slides.map(({ key }, index) => (
            <button
              key={key}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ke promo ${index + 1}`}
              aria-current={index === active}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${
                  index === active
                    ? 'w-7 bg-[#538CDB]'
                    : 'w-1.5 bg-[#D8DEE9] hover:bg-[#8FAED8]'
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