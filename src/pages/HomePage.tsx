import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PromoCarousel from '../components/layout/PromoCarousel';
import { NeedPayStrip } from '../components/ui/NeedPayNote';
import HeroSection from '../components/home/HeroSection';
import HomeBackground from '../components/home/HomeBackground';
import HomeSearch from '../components/home/HomeSearch';
import CategoryCard, {
  type PopularCategory,
} from '../components/home/CategoryCard';
import PriceRow from '../components/home/PriceRow';
import SectionHeading from '../components/home/SectionHeading';
import Icon from '../components/ui/Icon';

import { getProducts } from '../api/products';
import type { Product } from '../types';

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
    .sort((a, b) => b.sold - a.sold || b.products - a.products)
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

        <div className="pt-5 sm:pt-7">
          <PromoCarousel
            saleProducts={saleProducts}
            loading={loading}
            className="mx-auto w-full max-w-6xl px-4 sm:px-8"
          />
        </div>

        {/* ─────────────────────────────────────────
            SEARCH BAR
        ───────────────────────────────────────── */}
        <HomeSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          suggestOpen={suggestOpen}
          setSuggestOpen={setSuggestOpen}
        />

        {/* ─────────────────────────────────────────
            NEEDPAY STRIP — dengan Section Heading
        ───────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-8">
          <div
            className="
              overflow-hidden rounded-[24px] border border-white/80
              bg-white/80 p-5 shadow-[0_12px_32px_rgba(52,91,140,0.06)]
              backdrop-blur-md sm:p-6
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
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
                    text-[18px] font-bold leading-tight tracking-tight
                    text-[#20242D] sm:text-[20px]
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

            <NeedPayStrip />
          </div>
        </section>

        {/* ─────────────────────────────────────────
            ERROR
        ───────────────────────────────────────── */}
        {error && (
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
        )}

        {/* ─────────────────────────────────────────
            POPULAR CATEGORY
        ───────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-3 pt-14 sm:px-8">
          <SectionHeading
            eyebrow="Pilihan pengguna"
            title="Kategori paling populer"
            description="Produk yang paling sering dibeli pengguna NeedBuy."
            link="/categories"
            linkLabel="Lihat semua"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="
                      h-[92px] animate-pulse rounded-[20px]
                      border border-white/80 bg-white/80
                      shadow-[0_8px_20px_rgba(52,91,140,0.05)]
                    "
                  />
                ))
              : popularCategories.map((category, index) => (
                  <CategoryCard
                    key={category.slug}
                    category={category}
                    rank={index + 1}
                  />
                ))}
          </div>

          {!loading && !error && popularCategories.length === 0 && (
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
          )}
        </section>

        {/* ─────────────────────────────────────────
            TOP SELLING (tambahan — produk terlaris)
            Diambil dari data topSelling yang sudah di-fetch,
            tanpa perlu API call baru.
        ───────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-3 pt-10 sm:px-8">
          <SectionHeading
            eyebrow="Sedang tren"
            title="Produk paling laris"
            description="Yang paling banyak diborong pengguna NeedBuy minggu ini."
            link="/products?sort=sold"
            linkLabel="Lihat semua"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="
                      aspect-[3/4] animate-pulse rounded-[20px]
                      border border-white/80 bg-white/80
                      shadow-[0_8px_20px_rgba(52,91,140,0.05)]
                    "
                  />
                ))
              : topSelling.slice(0, 5).map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="
                      group relative flex flex-col overflow-hidden
                      rounded-[20px] border border-white/80 bg-white/95
                      shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
                      transition-all duration-200 hover:-translate-y-0.5
                      hover:shadow-[0_14px_36px_rgba(32,36,45,0.10)]
                    "
                  >
                    {/* Image */}
                    <div
                      className="
                        relative aspect-square w-full overflow-hidden
                        bg-[#F5F7FB]
                      "
                    >
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          loading="lazy"
                          className="
                            h-full w-full object-cover transition-transform
                            duration-500 group-hover:scale-105
                          "
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Icon
                            name="orders"
                            size={32}
                            className="text-[#538CDB]/30"
                          />
                        </div>
                      )}

                      {product.discountPercent > 0 && (
                        <span
                          className="
                            absolute left-2 top-2 inline-flex items-center
                            gap-1 rounded-full bg-[#FF4646] px-2 py-0.5
                            text-[9px] font-bold uppercase tracking-wider
                            text-white shadow-md
                          "
                        >
                          -{product.discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col p-3">
                      <h3
                        className="
                          line-clamp-2 text-[12px] font-semibold
                          leading-snug text-[#20242D]
                        "
                      >
                        {product.name}
                      </h3>

                      <p className="mt-1 text-[10px] text-[#737A87]">
                        {product.category?.name}
                      </p>

                      <p className="mt-auto pt-1.5 text-[13px] font-bold text-[#20242D]">
                        Rp{' '}
                        {Number(product.price).toLocaleString('id-ID')}
                      </p>

                      <p className="text-[9px] text-[#A2A8B3]">
                        {product.soldCount} terjual
                      </p>
                    </div>
                  </a>
                ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────
            PRICE LIST
        ───────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-8">
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
                  <div
                    key={i}
                    className="
                      h-14 animate-pulse rounded-xl bg-[#F5F7FB]
                      shadow-inner
                    "
                  />
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
                {cheapest.map((product) => (
                  <PriceRow key={product.id} product={product} />
                ))}
              </ul>
            )}
          </div>
        </section>
      </HomeBackground>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;