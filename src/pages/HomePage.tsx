// src/pages/HomePage.tsx
//
// Urutan halaman: promo (carousel) → kategori paling populer → daftar harga.
//
// Dua request saja: satu daftar produk terlaris (dipakai untuk slide diskon
// SEKALIGUS peringkat kategori populer) dan satu daftar termurah untuk daftar
// harga. Popularitas kategori dihitung dari `soldCount` produknya karena
// backend tidak punya endpoint peringkat kategori.
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PromoCarousel from '../components/layout/PromoCarousel';
import Icon, { type IconName } from '../components/ui/Icon';
import SearchSuggestions from '../components/ui/SearchSuggestions';
import { getProducts } from '../api/products';
import { formatRupiah } from '../utils/currency';
import type { Product } from '../types';

// ─── Icon mapping berdasarkan nama/slug kategori ───────────────────────────────
const getCategoryIcon = (name: string, slug: string): IconName => {
  const key = (name + slug).toLowerCase();
  if (key.includes('tech') || key.includes('elektro') || key.includes('computer') || key.includes('device'))
    return 'grid';
  if (key.includes('habitat') || key.includes('home') || key.includes('furnish') || key.includes('office'))
    return 'home';
  if (key.includes('culin') || key.includes('kitchen') || key.includes('food') || key.includes('masak'))
    return 'orders';
  if (key.includes('apparel') || key.includes('cloth') || key.includes('fashion') || key.includes('pakaian'))
    return 'tag';
  if (key.includes('maintenance') || key.includes('tool') || key.includes('repair') || key.includes('perawatan'))
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

/** Peringkat kategori dari produk terlaris: total terjual dulu, lalu jumlah produk. */
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

const CategoryCard: React.FC<{ category: PopularCategory; rank: number }> = ({ category, rank }) => (
  <Link
    to={`/categories/${category.slug}`}
    className="group flex items-center gap-4 rounded-2xl bg-[#eceef0] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e0e3e5] hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
  >
    <span className="relative shrink-0 rounded-xl bg-white/70 p-2.5">
      <Icon name={getCategoryIcon(category.name, category.slug)} size={20} className="text-[#004ac6]" />
      {/* Peringkat memang informasi di sini: kartunya diurut dari paling laris. */}
      <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#004ac6] text-[10px] font-bold text-white">
        {rank}
      </span>
    </span>

    <span className="min-w-0">
      <span className="block text-[15px] font-bold leading-tight text-[#004ac6]">{category.name}</span>
      <span className="mt-0.5 block text-[12px] text-[#434655]">
        {category.sold.toLocaleString('id-ID')} terjual · mulai {formatRupiah(category.cheapest)}
      </span>
    </span>
  </Link>
);

/** Satu baris daftar harga. Titik-titik penghubung dibuat dari border, bukan karakter. */
const PriceRow: React.FC<{ product: Product }> = ({ product }) => {
  const onSale = product.discountPercent > 0;
  const strike = onSale ? Math.round(Number(product.price) / (1 - product.discountPercent / 100)) : 0;

  return (
    <li>
      <Link
        to={`/products/${product.slug}`}
        className="group flex items-baseline gap-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
      >
        <span className="min-w-0 shrink">
          <span className="block truncate text-[14px] font-semibold text-[#191c1e] group-hover:text-[#004ac6]">
            {product.name}
          </span>
          <span className="text-[12px] text-[#737686]">
            {product.category?.name}
            {product.stock === 0 && ' · stok habis'}
          </span>
        </span>

        <span className="flex-1 border-b border-dotted border-[#c3c6d7]" aria-hidden="true" />

        <span className="shrink-0 text-right">
          <span className="block text-[15px] font-bold text-[#191c1e]">
            {formatRupiah(product.price)}
          </span>
          {onSale && (
            <span className="text-[11px] text-[#737686] line-through">{formatRupiah(strike)}</span>
          )}
        </span>
      </Link>
    </li>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────
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
        if (!cancelled) setError(err?.message ?? 'Gagal muat beranda, coba lagi ya');
      } finally {
        if (!cancelled) setLoading(false);
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
  const popularCategories = useMemo(() => rankCategories(topSelling), [topSelling]);

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      {/* ── 1. Promo: diskon + kenapa NeedBuy ──────────────────────────────────── */}
      <PromoCarousel saleProducts={saleProducts} loading={loading} />

      {/* Pencarian kebutuhan tetap dekat atas — ini pintu masuk fitur utamanya */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-10 pt-8">
        <form
          onSubmit={handleSearch}
          className="relative flex items-center gap-2 rounded-full border border-[#c3c6d7] bg-white px-4 py-2 shadow-sm transition-all focus-within:border-[#004ac6] focus-within:ring-2 focus-within:ring-[#004ac6]/15 sm:max-w-xl"
        >
          <Icon name="search" size={16} className="shrink-0 text-[#737686]" />
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
              if (e.key === 'Escape') setSuggestOpen(false);
            }}
            placeholder="Butuh laptop buat edit video, budget 15 juta..."
            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#191c1e] outline-none placeholder-[#737686]"
          />
          <button
            type="submit"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#004ac6] transition-colors hover:bg-[#003ea8]"
            aria-label="Cari"
          >
            <Icon name="arrowRight" size={16} className="text-white" />
          </button>

          {suggestOpen && (
            <SearchSuggestions term={searchQuery} onPick={() => setSuggestOpen(false)} />
          )}
        </form>
      </div>

      {error && (
        <div className="mx-auto mt-6 w-full max-w-6xl px-5 sm:px-10">
          <p className="rounded-2xl border border-[#ba1a1a]/20 bg-[#ffdad6] px-4 py-3 text-[13px] text-[#93000a]">
            {error}
          </p>
        </div>
      )}

      {/* ── 2. Kategori paling populer ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-10 pt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
              Paling banyak dibeli
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#191c1e]">Kategori paling populer</h2>
          </div>
          <Link
            to="/categories"
            className="shrink-0 text-[13px] text-[#434655] transition-colors hover:text-[#004ac6]"
          >
            Lihat semua
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[76px] animate-pulse rounded-2xl bg-[#eceef0]" />
              ))
            : popularCategories.map((category, index) => (
                <CategoryCard key={category.slug} category={category} rank={index + 1} />
              ))}
        </div>

        {!loading && !error && popularCategories.length === 0 && (
          <p className="py-10 text-center text-[14px] text-[#737686]">
            Belum ada kategori yang punya produk.
          </p>
        )}
      </section>

      {/* ── 3. Daftar harga ───────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-10 pb-20 pt-12">
        <div className="mb-2 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
              Termurah dulu
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#191c1e]">Daftar harga</h2>
          </div>
          <Link
            to="/categories"
            className="shrink-0 text-[13px] text-[#434655] transition-colors hover:text-[#004ac6]"
          >
            Lihat semua produk
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 pt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-[#f2f4f6]" />
            ))}
          </div>
        ) : cheapest.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-[#737686]">
            Belum ada produk yang dijual.
          </p>
        ) : (
          <ul className="divide-y divide-[#eceef0]">
            {cheapest.map((product) => (
              <PriceRow key={product.id} product={product} />
            ))}
          </ul>
        )}
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
