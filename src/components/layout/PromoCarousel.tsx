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
  gradient: string;
  accent: string;
};

const APP_PROMOS: AppPromo[] = [
  {
    eyebrow: 'NeedPay',
    title: 'Isi saldo sekali, checkout tinggal satu ketukan',
    body: 'Saldo NeedPay kepakai langsung pas bayar — nggak perlu buka aplikasi bank tiap belanja.',
    cta: 'Isi saldo NeedPay',
    to: '/needpay',
    icon: 'wallet',
    gradient: 'from-[#004ac6] via-[#1a5fc7] to-[#002a7a]',
    accent: '#004ac6',
  },
  {
    eyebrow: 'Cara belanja di NeedBuy',
    title: 'Tulis kebutuhanmu, kami yang nyariin',
    body: 'Ketik "laptop buat edit video, budget 15 juta". NeedBuy nyaring produk yang beneran cocok, bukan yang cuma lewat di beranda.',
    cta: 'Coba tulis kebutuhan',
    to: '/needs',
    icon: 'spark',
    gradient: 'from-[#7c3aed] via-[#8b5cf6] to-[#5b21b6]',
    accent: '#7c3aed',
  },
  {
    eyebrow: 'Rencana belanja',
    title: 'Belanja banyak, budget tetap kepegang',
    body: 'Susun daftar belanja, NeedBuy hitung totalnya dan kasih tau kalau kelewat budget — sebelum kamu checkout.',
    cta: 'Bikin rencana belanja',
    to: '/plans',
    icon: 'plan',
    gradient: 'from-[#059669] via-[#10b981] to-[#047857]',
    accent: '#059669',
  },
  {
    eyebrow: 'Kupon',
    title: 'Klaim kupon dulu, baru checkout',
    body: 'Kupon potongan nempel di akunmu dan otomatis kepakai pas bayar. Nggak ada kode yang kelupaan.',
    cta: 'Lihat kupon',
    to: '/coupons',
    icon: 'coupon',
    gradient: 'from-[#d97706] via-[#f59e0b] to-[#b45309]',
    accent: '#d97706',
  },
];

const SLIDE_MS = 6000;

// ── Slide Produk Diskon ──
const SaleSlide: React.FC<{ product: Product }> = ({ product }) => {
  const image = product.images?.[0]?.url;

  return (
    <div className="h-full w-full snap-center shrink-0">
      <Link
        to={`/products/${product.slug}`}
        className="group relative flex h-full min-h-[280px] flex-col-reverse sm:flex-row overflow-hidden rounded-2xl bg-gradient-to-br text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
        style={{ background: `linear-gradient(135deg, #ff5a1f 0%, #d94a0f 100%)` }}
      >
        {/* Dekorasi grafis */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 animate-float" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/5 animate-pulse-soft" />
        <div className="absolute right-1/4 top-1/4 h-16 w-16 rounded-full bg-white/5 animate-drift" />
        <div className="absolute left-1/2 bottom-1/3 h-8 w-8 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-1 flex-col justify-center p-6 sm:p-8">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
            <Icon name="tag" size={12} className="text-white" />
            Diskon {product.discountPercent}%
          </p>
          <h3 className="mt-3 text-[22px] sm:text-[28px] font-bold leading-[1.1] line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-1 text-[13px] text-white/80">{product.category?.name}</p>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatRupiah(product.price)}</span>
            <span className="text-sm text-white/70 line-through">
              {formatRupiah(strikePrice(product.price, product.discountPercent))}
            </span>
          </div>

          <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-[#ff5a1f] transition-transform group-hover:translate-x-0.5">
            Ambil sekarang
            <Icon name="arrowRight" size={16} className="text-[#ff5a1f]" />
          </span>
        </div>

        <div className="relative z-10 h-40 sm:h-auto sm:w-2/5 shrink-0 bg-white/15">
          {image ? (
            <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-white/50">
              <Icon name="orders" size={40} className="text-white/50" />
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

// ── Slide Promo Aplikasi ──
const AppSlide: React.FC<{ promo: AppPromo }> = ({ promo }) => (
  <div className="h-full w-full snap-center shrink-0">
    <div className={`relative flex h-full min-h-[280px] flex-col justify-between rounded-2xl bg-gradient-to-br ${promo.gradient} p-6 sm:p-8 text-white overflow-hidden`}>
      {/* Dekorasi grafis dengan animasi */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/5 animate-float" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/5 animate-pulse-soft" />
      <div className="absolute right-1/3 top-1/4 h-20 w-20 rounded-full bg-white/5 animate-drift" />
      <div className="absolute left-1/4 bottom-1/4 h-12 w-12 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute right-1/4 bottom-1/3 h-10 w-10 rounded-full bg-white/10 animate-pulse-soft" style={{ animationDelay: '0.8s' }} />

      {/* Garis dekoratif */}
      <div className="absolute right-0 top-0 h-32 w-32 rotate-12 border-r-2 border-t-2 border-white/10 rounded-tr-full" />
      <div className="absolute bottom-0 left-0 h-24 w-24 -rotate-6 border-b-2 border-l-2 border-white/10 rounded-bl-full" />

      <div className="relative z-10">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
          <Icon name={promo.icon} size={12} className="text-white" />
          {promo.eyebrow}
        </p>
        <h3 className="mt-3 max-w-xl text-[22px] sm:text-[28px] font-bold leading-[1.1]">
          {promo.title}
        </h3>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/85">{promo.body}</p>
      </div>

      <Link
        to={promo.to}
        className="relative z-10 mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-[#004ac6] hover:bg-[#dbe1ff] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        style={{ color: promo.accent }}
      >
        {promo.cta}
        <Icon name="arrowRight" size={16} className="text-[#004ac6]" />
      </Link>
    </div>
  </div>
);

const DEFAULT_SHELL = 'mx-auto w-full max-w-6xl px-5 sm:px-10 pt-6';

const PromoCarousel: React.FC<{
  saleProducts: Product[];
  loading?: boolean;
  className?: string;
}> = ({ saleProducts, loading = false, className = DEFAULT_SHELL }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Jika tidak ada produk diskon, tampilkan hanya slide aplikasi
  const hasSales = saleProducts.length > 0;
  const slides: Array<{ key: string; node: React.ReactNode }> = [
    ...(hasSales ? saleProducts.slice(0, 3).map((product) => ({
      key: `sale-${product.id}`,
      node: <SaleSlide product={product} />,
    })) : []),
    ...APP_PROMOS.map((promo) => ({ key: promo.to, node: <AppSlide promo={promo} /> })),
  ];

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = (index + slides.length) % slides.length;
    track.scrollTo({ left: track.clientWidth * clamped, behavior: 'smooth' });
  }, [slides.length]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  // Autoplay
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
      <section className={className}>
        <div className="h-[280px] animate-pulse rounded-2xl bg-[#f2f4f6]" />
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
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
        >
          {slides.map(({ key, node }) => (
            <div key={key} className="min-w-full">
              {node}
            </div>
          ))}
        </div>

        {/* Tombol navigasi */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Promo sebelumnya"
              className="absolute -left-4 top-1/2 hidden -translate-y-1/2 sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#191c1e] shadow-lg hover:bg-white transition-all z-10 backdrop-blur-sm"
            >
              <Icon name="chevronLeft" size={18} />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Promo berikutnya"
              className="absolute -right-4 top-1/2 hidden -translate-y-1/2 sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#191c1e] shadow-lg hover:bg-white transition-all z-10 backdrop-blur-sm"
            >
              <Icon name="chevronRight" size={18} />
            </button>
          </>
        )}
      </div>

      {/* Indikator */}
      {slides.length > 1 && (
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
      )}
    </section>
  );
};

export default PromoCarousel;