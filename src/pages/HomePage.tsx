// src/pages/HomePage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PromoCarousel from '../components/layout/PromoCarousel';
import Icon, { type IconName } from '../components/ui/Icon';
import SearchSuggestions from '../components/ui/SearchSuggestions';
import { DiscountChip, strikePrice } from '../components/ui/DiscountBadge';
import { NeedPayStrip } from '../components/ui/NeedPayNote';
import { getProducts } from '../api/products';
import { formatRupiah } from '../utils/currency';
import type { Product } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────────────────────────────────────

const BLUE = '#004ac6';
const BLUE_DARK = '#003a9e';
const BLUE_LIGHT = '#eef4ff';
const TEXT = '#191c1e';
const MUTED = '#737686';
const BORDER = '#dfe7f5';

// ─── Icon mapping berdasarkan nama/slug kategori ──────────────────────────────

const getCategoryIcon = (name: string, slug: string): IconName => {
  const key = (name + slug).toLowerCase();

  if (
    key.includes('tech') ||
    key.includes('elektro') ||
    key.includes('computer') ||
    key.includes('device')
  )
    return 'grid';

  if (
    key.includes('habitat') ||
    key.includes('home') ||
    key.includes('furnish') ||
    key.includes('office')
  )
    return 'home';

  if (
    key.includes('culin') ||
    key.includes('kitchen') ||
    key.includes('food') ||
    key.includes('masak')
  )
    return 'orders';

  if (
    key.includes('apparel') ||
    key.includes('cloth') ||
    key.includes('fashion') ||
    key.includes('pakaian')
  )
    return 'tag';

  if (
    key.includes('maintenance') ||
    key.includes('tool') ||
    key.includes('repair') ||
    key.includes('perawatan')
  )
    return 'plan';

  return 'spark';
};

type PopularCategory = {
  name: string;
  slug: string;
  sold: number;
  products: number;
  cheapest: number;
};

/**
 * Peringkat kategori dari produk terlaris.
 */
function rankCategories(products: Product[]): PopularCategory[] {
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
}

// ─────────────────────────────────────────────────────────────────────────────
// Category Card
// ─────────────────────────────────────────────────────────────────────────────

const CategoryCard: React.FC<{
  category: PopularCategory;
  rank: number;
}> = ({ category, rank }) => (
  <Link
    to={`/categories/${category.slug}`}
    className="
      group relative flex items-center gap-4
      overflow-hidden rounded-2xl
      border border-[#dfe7f5]
      bg-white
      p-4
      shadow-[0_2px_8px_rgba(0,74,198,0.04)]
      transition-all duration-200
      hover:-translate-y-1
      hover:border-[#b9cef4]
      hover:shadow-[0_8px_24px_rgba(0,74,198,0.10)]
      focus-visible:outline-2
      focus-visible:outline-offset-2
      focus-visible:outline-[#004ac6]
    "
  >
    {/* Accent kiri */}
    <span
      className="
        absolute left-0 top-4 bottom-4
        w-1 rounded-r-full
        bg-[#004ac6]
        opacity-0
        transition-opacity
        group-hover:opacity-100
      "
    />

    {/* Icon */}
    <span
      className="
        relative flex h-12 w-12 shrink-0
        items-center justify-center
        rounded-xl bg-[#eef4ff]
        text-[#004ac6]
        transition-colors
        group-hover:bg-[#004ac6]
        group-hover:text-white
      "
    >
      <Icon
        name={getCategoryIcon(category.name, category.slug)}
        size={21}
      />

      {/* Ranking */}
      <span
        className="
          absolute -left-2 -top-2
          flex h-5 w-5
          items-center justify-center
          rounded-full
          border-2 border-white
          bg-[#004ac6]
          text-[9px]
          font-bold
          text-white
        "
      >
        {rank}
      </span>
    </span>

    {/* Content */}
    <span className="min-w-0">
      <span
        className="
          block truncate
          text-[14px]
          font-bold
          leading-tight
          text-[#191c1e]
          transition-colors
          group-hover:text-[#004ac6]
        "
      >
        {category.name}
      </span>

      <span className="mt-1 block text-[11px] text-[#737686]">
        {category.sold.toLocaleString('id-ID')} terjual
      </span>

      <span className="mt-0.5 block text-[11px] font-medium text-[#004ac6]">
        Mulai {formatRupiah(category.cheapest)}
      </span>
    </span>

    {/* Arrow */}
    <span
      className="
        ml-auto shrink-0
        opacity-0
        -translate-x-1
        text-[#004ac6]
        transition-all
        group-hover:translate-x-0
        group-hover:opacity-100
      "
    >
      <Icon name="arrowRight" size={16} />
    </span>
  </Link>
);

// ─────────────────────────────────────────────────────────────────────────────
// Price Row
// ─────────────────────────────────────────────────────────────────────────────

const PriceRow: React.FC<{ product: Product }> = ({ product }) => {
  const onSale = product.discountPercent > 0;
  const strike = onSale
    ? strikePrice(product.price, product.discountPercent)
    : 0;

  return (
    <li>
      <Link
        to={`/products/${product.slug}`}
        className="
          group
          flex items-center gap-3
          rounded-xl
          px-3 py-3
          transition-colors
          hover:bg-[#f5f8ff]
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[#004ac6]
        "
      >
        {/* Product info */}
        <span className="min-w-0 shrink">
          <span className="flex items-center gap-1.5">
            <span
              className="
                truncate
                text-[13px]
                font-semibold
                text-[#191c1e]
                group-hover:text-[#004ac6]
              "
            >
              {product.name}
            </span>

            <DiscountChip
              discountPercent={product.discountPercent}
            />
          </span>

          <span className="mt-0.5 block text-[11px] text-[#737686]">
            {product.category?.name}
            {product.stock === 0 && ' · stok habis'}
          </span>
        </span>

        {/* Dotted separator */}
        <span
          className="
            hidden flex-1
            border-b border-dashed
            border-[#cbd7ea]
            sm:block
          "
          aria-hidden="true"
        />

        {/* Price */}
        <span className="shrink-0 text-right">
          <span className="block text-[13px] font-bold text-[#191c1e]">
            {formatRupiah(product.price)}
          </span>

          {onSale && (
            <span className="text-[10px] text-[#737686] line-through">
              {formatRupiah(strike)}
            </span>
          )}
        </span>

        {/* Arrow */}
        <span
          className="
            hidden text-[#004ac6]
            opacity-0
            transition-opacity
            group-hover:opacity-100
            sm:block
          "
        >
          <Icon name="arrowRight" size={14} />
        </span>
      </Link>
    </li>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section Heading
// ─────────────────────────────────────────────────────────────────────────────

const SectionHeading: React.FC<{
  eyebrow: string;
  title: string;
  description?: string;
  link?: string;
  linkLabel?: string;
}> = ({
  eyebrow,
  title,
  description,
  link,
  linkLabel = 'Lihat semua',
}) => (
  <div className="mb-5 flex items-end justify-between gap-4">
    <div>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#004ac6]" />

        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-[#004ac6]
          "
        >
          {eyebrow}
        </p>
      </div>

      <h2
        className="
          mt-1.5
          text-xl
          font-bold
          tracking-tight
          text-[#191c1e]
          sm:text-2xl
        "
      >
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-[12px] text-[#737686]">
          {description}
        </p>
      )}
    </div>

    {link && (
      <Link
        to={link}
        className="
          shrink-0
          rounded-full
          px-3 py-1.5
          text-[11px]
          font-semibold
          text-[#004ac6]
          transition-colors
          hover:bg-[#eef4ff]
        "
      >
        {linkLabel}
      </Link>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Home Page
// ─────────────────────────────────────────────────────────────────────────────

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
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const saleProducts = useMemo(
    () =>
      topSelling.filter(
        (product) => product.discountPercent > 0
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
        bg-[#f7faff]
        text-[#191c1e]
      "
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <Navbar showSearch={false} />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO AREA
      ═══════════════════════════════════════════════════════════════════════ */}

      <main className="relative flex-1 overflow-hidden">
        {/* Background decoration */}
        <div
          className="
            pointer-events-none
            absolute
            -top-32
            left-1/2
            h-[420px]
            w-[700px]
            -translate-x-1/2
            rounded-full
            bg-[#dceaff]
            opacity-60
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[-180px]
            top-[520px]
            h-[380px]
            w-[380px]
            rounded-full
            bg-[#e9f1ff]
            opacity-80
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-[-180px]
            top-[850px]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[#edf4ff]
            opacity-70
            blur-3xl
          "
        />

        {/* Small decorative dots */}
        <span className="pointer-events-none absolute left-[7%] top-36 h-2 w-2 rounded-full bg-[#004ac6]/20" />
        <span className="pointer-events-none absolute right-[12%] top-64 h-3 w-3 rounded-full bg-[#004ac6]/15" />

        <div className="relative z-10">
          {/* ── Promo ─────────────────────────────────────────────────────── */}
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

          {/* ── Search ────────────────────────────────────────────────────── */}
          <section className="mx-auto w-full max-w-6xl px-4 pt-7 sm:px-8">
            <div
              className="
                relative
                rounded-2xl
                border
                border-[#d8e4f6]
                bg-white
                p-3
                shadow-[0_8px_30px_rgba(0,74,198,0.06)]
                sm:max-w-3xl
              "
            >
              {/* Search heading */}
              <div className="mb-2 flex items-center gap-2 px-2">
                <span
                  className="
                    flex h-7 w-7
                    items-center justify-center
                    rounded-lg
                    bg-[#eef4ff]
                    text-[#004ac6]
                  "
                >
                  <Icon name="search" size={14} />
                </span>

                <div>
                  <p className="text-[11px] font-bold text-[#191c1e]">
                    Lagi cari apa?
                  </p>
                  <p className="text-[9px] text-[#737686]">
                    Tulis kebutuhanmu, kami bantu cari.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSearch}
                className="
                  relative
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#f5f8fd]
                  px-3
                  py-1.5
                  transition-all
                  focus-within:bg-white
                  focus-within:ring-2
                  focus-within:ring-[#004ac6]/15
                "
              >
                <Icon
                  name="search"
                  size={16}
                  className="shrink-0 text-[#737686]"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSuggestOpen(true);
                  }}
                  onFocus={() => setSuggestOpen(true)}
                  onBlur={() => setSuggestOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSuggestOpen(false);
                    }
                  }}
                  placeholder="Contoh: laptop buat edit video, budget 15 juta..."
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    py-2
                    text-[12px]
                    text-[#191c1e]
                    outline-none
                    placeholder-[#8a90a0]
                  "
                />

                <button
                  type="submit"
                  className="
                    flex h-8 w-8
                    shrink-0
                    items-center justify-center
                    rounded-lg
                    bg-[#004ac6]
                    text-white
                    transition-all
                    hover:bg-[#003a9e]
                    hover:shadow-md
                    active:scale-95
                  "
                  aria-label="Cari"
                >
                  <Icon name="arrowRight" size={15} />
                </button>

                {suggestOpen && (
                  <SearchSuggestions
                    term={searchQuery}
                    onPick={() => setSuggestOpen(false)}
                  />
                )}
              </form>
            </div>
          </section>

          {/* ── NeedPay ───────────────────────────────────────────────────── */}
          <section className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-8">
            <NeedPayStrip />
          </section>

          {/* ── Error ─────────────────────────────────────────────────────── */}
          {error && (
            <div className="mx-auto mt-5 w-full max-w-6xl px-4 sm:px-8">
              <div
                className="
                  flex items-center gap-3
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  px-4 py-3
                  text-[12px]
                  text-red-700
                "
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                  !
                </span>

                <p>{error}</p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              POPULAR CATEGORY
          ═══════════════════════════════════════════════════════════════ */}

          <section className="mx-auto w-full max-w-6xl px-4 pb-3 pt-12 sm:px-8">
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
                        h-[82px]
                        animate-pulse
                        rounded-2xl
                        border
                        border-[#e2e9f4]
                        bg-white
                      "
                    />
                  ))
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
                    rounded-2xl
                    border border-dashed
                    border-[#cbd7ea]
                    bg-white
                    py-12
                    text-center
                  "
                >
                  <Icon
                    name="grid"
                    size={28}
                    className="mx-auto text-[#b5c6df]"
                  />

                  <p className="mt-3 text-[13px] text-[#737686]">
                    Belum ada kategori yang punya produk.
                  </p>
                </div>
              )}
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              PRICE LIST
          ═══════════════════════════════════════════════════════════════ */}

          <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-8">
            <div
              className="
                rounded-2xl
                border border-[#dfe7f5]
                bg-white
                p-4
                shadow-[0_3px_15px_rgba(0,74,198,0.04)]
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

              {/* Header kecil */}
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
                  <Icon
                    name="tag"
                    size={28}
                    className="mx-auto text-[#b5c6df]"
                  />

                  <p className="mt-3 text-[13px] text-[#737686]">
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
        </div>
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;