// src/pages/HomePage.tsx
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PromoCarousel from '../components/layout/PromoCarousel';
import { NeedPayStrip } from '../components/ui/NeedPayNote';

import HomeBackground from '../components/home/HomeBackground';
import HomeSearch from '../components/home/HomeSearch';
import CategoryCard, {
  type PopularCategory,
} from '../components/home/CategoryCard';
import PriceRow from '../components/home/PriceRow';
import SectionHeading from '../components/home/SectionHeading';

import { getProducts } from '../api/products';
import type { Product } from '../types';

const rankCategories = (
  products: Product[]
): PopularCategory[] => {
  const byslug = new Map<string, PopularCategory>();

  for (const product of products) {
    if (!product.category) continue;

    const price = Number(product.price);
    const current = byslug.get(product.category.slug);

    if (current) {
      current.sold += product.soldCount;
      current.products += 1;
      current.cheapest = Math.min(
        current.cheapest,
        price
      );
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
    .sort(
      (a, b) =>
        b.sold - a.sold ||
        b.products - a.products
    )
    .slice(0, 6);
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] =
    useState('');

  const [suggestOpen, setSuggestOpen] =
    useState(false);

  const [topSelling, setTopSelling] =
    useState<Product[]>([]);

  const [cheapest, setCheapest] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [sold, byPrice] =
          await Promise.all([
            getProducts({
              sort: 'sold',
              limit: 100,
            }),
            getProducts({
              sort: 'price_asc',
              limit: 12,
            }),
          ]);

        if (cancelled) return;

        setTopSelling(sold.data);
        setCheapest(byPrice.data);
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.message ??
              'Gagal muat beranda, coba lagi ya'
          );
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
    () =>
      topSelling.filter(
        (product) =>
          product.discountPercent > 0
      ),
    [topSelling]
  );

  const popularCategories = useMemo(
    () => rankCategories(topSelling),
    [topSelling]
  );

  const handleSearch = (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex flex-col
        text-[#191c1e]
      "
      style={{
        fontFamily:
          "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <Navbar showSearch={false} />

      <HomeBackground>
        {/* ─────────────────────────────────────────
            HERO / PROMO
        ───────────────────────────────────────── */}

        <div className="pt-5 sm:pt-7">
          <PromoCarousel
            saleProducts={saleProducts}
            loading={loading}
            className="
              mx-auto
              w-full
              max-w-6xl
              px-4
              sm:px-8
            "
          />
        </div>

        {/* ─────────────────────────────────────────
            SEARCH
        ───────────────────────────────────────── */}

        <HomeSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          suggestOpen={suggestOpen}
          setSuggestOpen={setSuggestOpen}
        />


        <section className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-8">
          <NeedPayStrip />
        </section>

        {/* ─────────────────────────────────────────
            ERROR
        ───────────────────────────────────────── */}

        {error && (
          <div className="mx-auto mt-5 w-full max-w-6xl px-4 sm:px-8">
            <div
              className="
                flex items-center gap-3
                rounded-2xl
                border border-red-200/70
                bg-red-50/80
                px-4 py-3
                text-[12px]
                text-red-700
                backdrop-blur-sm
              "
            >
              <span
                className="
                  flex h-7 w-7
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-red-100
                  font-bold
                "
              >
                !
              </span>

              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────
            POPULAR CATEGORY
        ───────────────────────────────────────── */}

        <section
          className="
            mx-auto
            w-full
            max-w-6xl
            px-4
            pb-3
            pt-14
            sm:px-8
          "
        >
          <SectionHeading
            eyebrow="Pilihan pengguna"
            title="Kategori paling populer"
            description="Produk yang paling sering dibeli pengguna NeedBuy."
            link="/categories"
            linkLabel="Lihat semua"
          />

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {loading
              ? Array.from({ length: 6 }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="
                        h-[82px]
                        animate-pulse
                        rounded-[22px]
                        border
                        border-white/70
                        bg-white/60
                      "
                    />
                  )
                )
              : popularCategories.map(
                  (category, index) => (
                    <CategoryCard
                      key={category.slug}
                      category={category}
                      rank={index + 1}
                    />
                  )
                )}
          </div>

          {!loading &&
            !error &&
            popularCategories.length === 0 && (
              <div
                className="
                  rounded-[22px]
                  border
                  border-dashed
                  border-[#cbd7ea]
                  bg-white/55
                  py-12
                  text-center
                  backdrop-blur-sm
                "
              >
                <p className="text-[13px] text-[#737686]">
                  Belum ada kategori yang punya
                  produk.
                </p>
              </div>
            )}
        </section>

        {/* ─────────────────────────────────────────
            PRICE LIST
        ───────────────────────────────────────── */}

        <section
          className="
            mx-auto
            w-full
            max-w-6xl
            px-4
            pb-20
            pt-10
            sm:px-8
          "
        >
          <div
            className="
              overflow-hidden
              rounded-[26px]
              border border-white
              bg-white/75
              p-4
              shadow-[0_12px_40px_rgba(52,91,140,0.08)]
              backdrop-blur-xl
              sm:p-5
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
                mb-2
                hidden
                items-center
                justify-between
                border-b
                border-[#edf1f7]
                px-3
                pb-2
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-[#9aa1b1]
                sm:flex
              "
            >
              <span>Produk</span>
              <span>Harga</span>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="
                        h-12
                        animate-pulse
                        rounded-xl
                        bg-[#f5f7fb]
                      "
                    />
                  )
                )}
              </div>
            ) : cheapest.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[13px] text-[#737686]">
                  Belum ada produk yang dijual.
                </p>
              </div>
            ) : (
              <ul className="space-y-1">
                {cheapest.map((product) => (
                  <PriceRow
                    key={product.id}
                    product={product}
                  />
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