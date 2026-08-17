import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PromoCarousel from '../components/layout/PromoCarousel';
import {
  NeedPayStrip,
  PaymentTile,
  PAYMENT_METHODS,
} from '../components/ui/NeedPayNote';
import HeroSection from '../components/home/HeroSection';
import HomeBackground from '../components/home/HomeBackground';
import HomeSearch from '../components/home/HomeSearch';
import CategoryCard, {
  type PopularCategory,
} from '../components/home/CategoryCard';
import PriceRow from '../components/home/PriceRow';
import SectionHeading from '../components/home/SectionHeading';
import Icon from '../components/ui/Icon';
import Reveal from '../components/ui/Reveal';
import ProductCard from '../components/ui/ProductCard';

import { getProducts } from '../api/products';
import type { Product } from '../types';

/** Helper untuk delay stagger — tiap card muncul berurutan. */
const stagger = (index: number, base = 80) => index * base;

const rankCategories = (products: Product[]): PopularCategory[] => {
  const byslug = new Map<string, PopularCategory>();

  for (const product of products) {
    if (!product.category) continue;

    const price = Number(product.price);
    const current = byslug.get(product.category.slug);

    if (current) {
      current.sold += product.soldCount;
      current.products += 1;
      current.cheapest = Math.min(current.cheapest, price);
    } else {
      byslug.set(product.category.slug, {
        name: product.category.name,
        slug: product.category.slug,
        sold: product.soldCount,
        products: 1,
        cheapest: price,
      });
    }
  }

  return [...byslug.values()]
    .sort((a, b) => b.sold - a.products || b.products - a.products)
    .slice(0, 6);
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [cheapest, setCheapest] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [sold, byPrice] = await Promise.all([
          getProducts({ sort: 'sold', limit: 100 }),
          getProducts({ sort: 'price_asc', limit: 12 }),
        ]);

        if (cancelled) return;

        setTopSelling(sold.data);
        setCheapest(byPrice.data);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? 'Gagal muat beranda, coba lagi ya');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const saleProducts = useMemo(
    () => topSelling.filter((product) => product.discountPercent > 0),
    [topSelling]
  );

  const popularCategories = useMemo(
    () => rankCategories(topSelling),
    [topSelling]
  );

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col text-[#191c1e]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar showSearch={false} />

      <HomeBackground>
        {/* ─────────────────────────────────────────
            HERO / PROMO CAROUSEL
        ───────────────────────────────────────── */}
        <HeroSection />

        {/* ─────────────────────────────────────────
            SEARCH BAR
        ───────────────────────────────────────── */}
        <HomeSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          suggestOpen={suggestOpen}
          setSuggestOpen={setSuggestOpen}
          showSuggestions={false}
        />

        {/* ─────────────────────────────────────────
            PROMO CAROUSEL (reveal)
        ───────────────────────────────────────── */}
        <Reveal direction="up" duration={800}>
          <div className="pt-5 sm:pt-7">
            <PromoCarousel
              saleProducts={saleProducts}
              loading={loading}
              className="mx-auto w-full max-w-6xl px-4 sm:px-8"
            />
          </div>
        </Reveal>

        {/* ─────────────────────────────────────────
            NEEDPAY STRIP + METODE PEMBAYARAN
        ───────────────────────────────────────── */}
        <Reveal direction="up" delay={100}>
          <section className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-8">
            <div
              className="
                overflow-hidden rounded-[24px] border border-white/80
                bg-white/80 p-4 shadow-[0_12px_32px_rgba(52,91,140,0.06)]
                backdrop-blur-md sm:p-5 md:p-6
              "
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
                <div className="min-w-0">
                  <p
                    className="
                      mb-1 text-[10px] font-semibold uppercase
                      tracking-[0.18em] text-[#538CDB]
                    "
                  >
                    Pembayaran cepat
                  </p>
                  <h2
                    className="
                      text-[16px] font-bold leading-tight tracking-tight
                      text-[#20242D] sm:text-[18px] md:text-[20px]
                    "
                  >
                    NeedPay, saldo sekali untuk semua
                  </h2>
                </div>

                <Link to="/needpay" className="hidden sm:block">
                  <span
                    className="
                      inline-flex items-center gap-1.5 rounded-full
                      bg-[#538CDB]/10 px-3.5 py-1.5 text-[11px] font-semibold
                      text-[#538CDB] transition-colors hover:bg-[#538CDB]/15
                    "
                  >
                    Kelola saldo
                    <Icon name="arrowRight" size={12} />
                  </span>
                </Link>
              </div>

              {/* Konten: banner kiri + metode pembayaran kanan */}
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                {/* Banner saldo */}
                <NeedPayStrip className="w-full lg:w-[430px] lg:shrink-0" />

                {/* Pembatas vertikal (desktop) / horizontal (mobile) */}
                <div className="h-px w-full bg-[#E8ECF4] lg:hidden" />
                <div className="hidden h-24 w-px bg-[#E8ECF4] lg:block" />

                {/* Grid metode pembayaran */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2.5 flex items-center justify-between">
                    <p
                      className="
                        text-[10px] font-semibold uppercase tracking-[0.18em]
                        text-[#737A87]
                      "
                    >
                      Isi saldo lewat
                    </p>

                    <span
                      className="
                        inline-flex items-center gap-1.5 text-[10px] font-medium
                        text-[#A2A8B3]
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                      Gratis biaya admin
                    </span>
                  </div>

                  {/* Grid: 4 kolom mobile, 8 kolom desktop */}
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {PAYMENT_METHODS.map((method) => (
                      <PaymentTile key={method.label} method={method} />
                    ))}
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-[#737A87]">
                    Satu saldo untuk semua transaksi di NeedBuy — checkout
                    tinggal satu ketukan.
                  </p>

                  {/* CTA mobile — Link kelola saldo */}
                  <Link to="/needpay" className="mt-3 block sm:hidden">
                    <span
                      className="
                        inline-flex items-center gap-1.5 rounded-full
                        bg-[#538CDB]/10 px-3.5 py-1.5 text-[11px] font-semibold
                        text-[#538CDB] transition-colors hover:bg-[#538CDB]/15
                      "
                    >
                      Kelola saldo
                      <Icon name="arrowRight" size={12} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ─────────────────────────────────────────
            ERROR
        ───────────────────────────────────────── */}
        {error && (
          <Reveal direction="up">
            <div className="mx-auto mt-6 w-full max-w-6xl px-4 sm:px-8">
              <div
                className="
                  flex items-center gap-3 rounded-2xl border
                  border-[#FF4646]/20 bg-[#FFF0F0] px-4 py-3
                  text-[13px] text-[#C73535] backdrop-blur-sm
                "
              >
                <span
                  className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-full bg-[#FF4646]/15 text-sm font-bold
                    text-[#FF4646]
                  "
                >
                  !
                </span>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </Reveal>
        )}

        {/* ─────────────────────────────────────────
            POPULAR CATEGORY
        ───────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-3 pt-10 sm:px-8 md:pt-14">
          <Reveal direction="up">
            <SectionHeading
              eyebrow="Pilihan pengguna"
              title="Kategori paling populer"
              description="Produk yang paling sering dibeli pengguna NeedBuy."
              link="/categories"
              linkLabel="Lihat semua"
            />
          </Reveal>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Reveal key={i} direction="up" delay={stagger(i)}>
                    <div
                      className="
                        h-[92px] animate-pulse rounded-[20px]
                        border border-white/80 bg-white/80
                        shadow-[0_8px_20px_rgba(52,91,140,0.05)]
                      "
                    />
                  </Reveal>
                ))
              : popularCategories.map((category, index) => (
                  <Reveal key={category.slug} direction="up" delay={stagger(index)}>
                    <CategoryCard category={category} rank={index + 1} />
                  </Reveal>
                ))}
          </div>

          {!loading && !error && popularCategories.length === 0 && (
            <Reveal direction="up">
              <div
                className="
                  rounded-[22px] border border-dashed border-[#D8DEE9]
                  bg-white/70 py-14 text-center backdrop-blur-sm
                "
              >
                <p className="text-[13px] text-[#737A87]">
                  Belum ada kategori yang punya produk.
                </p>
              </div>
            </Reveal>
          )}
        </section>

        {/* ─────────────────────────────────────────
            TOP SELLING
        ───────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-3 pt-8 sm:px-8 md:pt-10">
          <Reveal direction="up">
            <SectionHeading
              eyebrow="Sedang tren"
              title="Produk paling laris"
              description="Yang paling banyak diborong pengguna NeedBuy minggu ini."
              link="/products?sort=sold"
              linkLabel="Lihat semua"
            />
          </Reveal>

          {/* Grid responsif: 2 mobile → 3 tablet → 5 desktop */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Reveal key={i} direction="up" delay={stagger(i)} className="h-full">
                    <div
                      className="
                        h-full animate-pulse overflow-hidden rounded-2xl border
                        border-white/80 bg-white/80
                      "
                    >
                      <div className="aspect-[4/3] bg-[#F5F7FB]" />
                      <div className="space-y-2 p-3.5">
                        <div className="h-3 w-20 rounded-full bg-[#F5F7FB]" />
                        <div className="h-4 rounded-full bg-[#F5F7FB]" />
                        <div className="h-4 w-24 rounded-full bg-[#F5F7FB]" />
                      </div>
                    </div>
                  </Reveal>
                ))
              : topSelling.slice(0, 5).map((product, index) => (
                  <Reveal
                    key={product.id}
                    direction="up"
                    delay={stagger(index)}
                    className="h-full"
                  >
                    <ProductCard product={product} />
                  </Reveal>
                ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────
            PRICE LIST
        ───────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-8 md:pt-10">
          <Reveal direction="up">
            <div
              className="
                overflow-hidden rounded-[24px] border border-white/80
                bg-white/95 p-4 shadow-[0_18px_50px_rgba(32,36,45,0.08)]
                backdrop-blur-sm sm:p-5
              "
            >
              <SectionHeading
                eyebrow="Harga terbaik"
                title="Daftar harga"
                description="Mulai dari produk dengan harga paling terjangkau."
                link="/categories"
                linkLabel="Lihat semua produk"
              />

              <div
                className="
                  mb-2 hidden items-center justify-between border-b
                  border-[#E8ECF4] px-3 pb-2 text-[9px] font-bold
                  uppercase tracking-wider text-[#737A87] sm:flex
                "
              >
                <span>Produk</span>
                <span>Harga</span>
              </div>

              {loading ? (
                <div className="space-y-2 pt-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Reveal key={i} direction="up" delay={stagger(i, 50)}>
                      <div
                        className="
                          h-14 animate-pulse rounded-xl bg-[#F5F7FB]
                          shadow-inner
                        "
                      />
                    </Reveal>
                  ))}
                </div>
              ) : cheapest.length === 0 ? (
                <div
                  className="
                    rounded-[22px] border border-dashed border-[#D8DEE9]
                    bg-white/70 py-14 text-center
                  "
                >
                  <p className="text-[13px] text-[#737A87]">
                    Belum ada produk yang dijual.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1 pt-2">
                  {cheapest.map((product, index) => (
                    <Reveal key={product.id} direction="up" delay={stagger(index, 40)}>
                      <PriceRow product={product} />
                    </Reveal>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </section>
      </HomeBackground>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;