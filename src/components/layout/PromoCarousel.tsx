// src/components/layout/PromoCarousel.tsx
//
// Carousel promo di paling atas home. Geser pakai scroll-snap bawaan browser —
// tombol prev/next dan titik indikator cuma memanggil scrollTo, jadi swipe di
// HP, drag di trackpad, dan panah keyboard jalan tanpa library carousel.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon, { type IconName } from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { Product } from '../../types';

/** Harga sebelum diskon, dihitung balik dari harga jual. */
const strikePrice = (price: string, discountPercent: number): number =>
  Math.round(Number(price) / (1 - discountPercent / 100));

/** Promo tentang aplikasi — isinya tetap, tidak tergantung data produk. */
type AppPromo = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  icon: IconName;
};

const APP_PROMOS: AppPromo[] = [
  {
    eyebrow: 'Cara belanja di NeedBuy',
    title: 'Tulis kebutuhanmu, kami yang nyariin',
    body: 'Ketik "laptop buat edit video, budget 15 juta". NeedBuy nyaring produk yang beneran cocok, bukan yang cuma lewat di beranda.',
    cta: 'Coba tulis kebutuhan',
    to: '/needs',
    icon: 'spark',
  },
  {
    eyebrow: 'Rencana belanja',
    title: 'Belanja banyak, budget tetap kepegang',
    body: 'Susun daftar belanja, NeedBuy hitung totalnya dan kasih tau kalau kelewat budget — sebelum kamu checkout.',
    cta: 'Bikin rencana belanja',
    to: '/plans',
    icon: 'plan',
  },
  {
    eyebrow: 'Kupon',
    title: 'Klaim kupon dulu, baru checkout',
    body: 'Kupon potongan nempel di akunmu dan otomatis kepakai pas bayar. Nggak ada kode yang kelupaan.',
    cta: 'Lihat kupon',
    to: '/coupons',
    icon: 'coupon',
  },
];

const SLIDE_MS = 6000;

const SaleSlide: React.FC<{ product: Product }> = ({ product }) => {
  const image = product.images?.[0]?.url;

  return (
    <article className="snap-center shrink-0 w-full">
      <Link
        to={`/products/${product.slug}`}
        className="group flex h-full flex-col-reverse sm:flex-row overflow-hidden rounded-3xl bg-[#ff5a1f] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
      >
        <div className="flex-1 p-6 sm:p-8">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
            <Icon name="tag" size={12} className="text-white" />
            Diskon {product.discountPercent}%
          </p>
          <h3 className="mt-3 text-[26px] sm:text-[32px] font-bold leading-[1.1] line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-2 text-[13px] text-white/80">{product.category?.name}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-[28px] font-bold">{formatRupiah(product.price)}</span>
            <span className="text-[15px] text-white/70 line-through">
              {formatRupiah(strikePrice(product.price, product.discountPercent))}
            </span>
          </div>

          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#ff5a1f] transition-transform group-hover:translate-x-0.5">
            Ambil sekarang
            <Icon name="arrowRight" size={16} className="text-[#ff5a1f]" />
          </span>
        </div>

        <div className="h-40 sm:h-auto sm:w-2/5 shrink-0 bg-white/15">
          {image ? (
            <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-white/50">
              <Icon name="orders" size={40} className="text-white/50" />
            </span>
          )}
        </div>
      </Link>
    </article>
  );
};

const AppSlide: React.FC<{ promo: AppPromo }> = ({ promo }) => (
  <article className="snap-center shrink-0 w-full">
    <div className="flex h-full flex-col justify-between rounded-3xl bg-[#004ac6] p-6 sm:p-8 text-white">
      <div>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
          <Icon name={promo.icon} size={12} className="text-white" />
          {promo.eyebrow}
        </p>
        <h3 className="mt-3 max-w-xl text-[26px] sm:text-[32px] font-bold leading-[1.1]">
          {promo.title}
        </h3>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/85">{promo.body}</p>
      </div>

      <Link
        to={promo.to}
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#004ac6] hover:bg-[#dbe1ff] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {promo.cta}
        <Icon name="arrowRight" size={16} className="text-[#004ac6]" />
      </Link>
    </div>
  </article>
);

/**
 * @param saleProducts produk diskon untuk slide promo harga. Boleh kosong —
 *   carousel-nya tetap berisi promo aplikasi, jadi tidak ada diskon palsu.
 */
const PromoCarousel: React.FC<{ saleProducts: Product[]; loading?: boolean }> = ({
  saleProducts,
  loading = false,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Slide diskon didahulukan: itu alasan orang berhenti di beranda.
  const slides: Array<{ key: string; node: React.ReactNode }> = [
    ...saleProducts.slice(0, 3).map((product) => ({
      key: `sale-${product.id}`,
      node: <SaleSlide product={product} />,
    })),
    ...APP_PROMOS.map((promo) => ({ key: promo.to, node: <AppSlide promo={promo} /> })),
  ];

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = (index + slides.length) % slides.length;
    track.scrollTo({ left: track.clientWidth * clamped, behavior: 'smooth' });
  }, [slides.length]);

  // Titik aktif dibaca dari posisi scroll, bukan disimpan terpisah — kalau
  // user swipe sendiri, indikatornya tetap benar.
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  // Autoplay berhenti saat di-hover/di-fokus, dan tidak pernah jalan kalau user
  // minta reduced motion.
  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track || track.clientWidth === 0) return;
      const next = (Math.round(track.scrollLeft / track.clientWidth) + 1) % slides.length;
      track.scrollTo({ left: track.clientWidth * next, behavior: 'smooth' });
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-10 pt-6">
        <div className="h-[300px] animate-pulse rounded-3xl bg-[#f2f4f6]" />
      </section>
    );
  }

  return (
    <section
      className="mx-auto w-full max-w-6xl px-5 sm:px-10 pt-6"
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
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
        >
          {slides.map(({ key, node }) => (
            <div key={key} className="min-w-full">
              {node}
            </div>
          ))}
        </div>

        {/* Tombol geser — disembunyikan di layar kecil, di sana swipe lebih enak */}
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Promo sebelumnya"
          className="absolute left-3 top-1/2 hidden -translate-y-1/2 sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#191c1e] shadow-md hover:bg-white transition-colors"
        >
          <Icon name="chevronLeft" size={18} className="" />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Promo berikutnya"
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#191c1e] shadow-md hover:bg-white transition-colors"
        >
          <Icon name="chevronRight" size={18} className="" />
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map(({ key }, index) => (
          <button
            key={key}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Ke promo ${index + 1}`}
            aria-current={index === active}
            className={`h-2 rounded-full transition-all ${
              index === active ? 'w-6 bg-[#004ac6]' : 'w-2 bg-[#c3c6d7] hover:bg-[#737686]'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default PromoCarousel;
