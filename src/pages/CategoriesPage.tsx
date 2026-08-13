// src/pages/CategoriesPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import DiscountBadge, { PriceWithDiscount } from '../components/ui/DiscountBadge';
import { NeedPayStrip } from '../components/ui/NeedPayNote';
import Pagination from '../components/ui/Pagination';
import FilterSidebar from '../components/ui/filter/FilterSidebar';
import Navbar from '../components/layout/Navbar';
import PromoCarousel from '../components/layout/PromoCarousel';
import Footer from '../components/layout/Footer';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { addToCart } from '../api/cart';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../hooks/useWishlist';
import type { GetProductsParams } from '../api/products';
import type { Category, Product } from '../types';

const SORT_OPTIONS = ['Paling Cocok', 'Harga: Rendah ke Tinggi', 'Harga: Tinggi ke Rendah', 'Terbaru'];
const CONDITIONS = ['Baru', 'Seperti Baru', 'Refurbished'];

const PAGE_SIZE = 24;

// ─── Product Card ──────────────────────────────────────────────────────────────
const ProductCard: React.FC<{ product: Product; onNavigate: (slug: string) => void }> = ({
  product,
  onNavigate,
}) => {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refreshCartCount } = useCart();
  const { saved: wishlisted, busy: wishlistBusy, toggle: toggleWishlist } = useWishlist(product.id);
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist();
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      await refreshCartCount();
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      setAdded(false);
    }
  };

  return (
    <div
      onClick={() => onNavigate(product.slug)}
      className="group bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-4/3 bg-[#f2f4f6] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <DiscountBadge discountPercent={product.discountPercent} price={product.price} />
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistBusy}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label="Simpan ke wishlist"
        >
          <Icon name="heart" size={14} className={`transition-colors ${wishlisted ? 'text-[#004ac6]' : 'text-[#737686]'}`} />
        </button>
      </div>
      <div className="p-3.5 flex flex-col flex-1">
        <span className="block truncate text-[11px] font-semibold text-[#004ac6] uppercase tracking-wide">
          {product.seller.storeName}
        </span>
        <h3 className="mt-1 text-[13px] font-semibold text-[#191c1e] leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <svg className="w-3 h-3 text-[#ffb020] fill-[#ffb020] shrink-0" viewBox="0 0 16 16">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.192L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
          </svg>
          <span className="text-[11px] text-[#737686]">{product.rating}</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-1">
          <PriceWithDiscount price={product.price} discountPercent={product.discountPercent} />
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 shrink-0 rounded-full bg-[#191c1e] hover:bg-[#004ac6] text-white flex items-center justify-center transition-colors duration-200"
            aria-label="Tambah ke keranjang"
          >
            {added ? <Icon name="check" size={14} /> : <Icon name="cart" size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────
const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories: apiCategories, loading: catLoading } = useCategories();
  const [page, setPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [activeConditions, setActiveConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // ── Ambil produk dari API ────────────────────────────────────────────────
  //
  // SELURUH filter ikut dikirim ke server, bukan disaring di client. Paginasi
  // di halaman ini server-side: kalau filternya dijalankan di client, yang
  // tersaring cuma 24 item halaman berjalan sementara jumlah halamannya masih
  // menghitung seluruh katalog — hasilnya halaman yang kelihatan kosong padahal
  // paginasinya bilang masih ada 30 halaman lagi.
  const params: GetProductsParams = useMemo(() => {
    const p: GetProductsParams = { limit: PAGE_SIZE, page };
    if (sortBy === 'Harga: Rendah ke Tinggi') p.sort = 'price_asc';
    else if (sortBy === 'Harga: Tinggi ke Rendah') p.sort = 'price_desc';
    else if (sortBy === 'Terbaru') p.sort = 'newest';
    // 'Paling Cocok' = tidak kirim sort, biar server pakai default

    if (selectedCategories.length > 0) p.categorySlugs = selectedCategories.join(',');
    if (activeConditions.length > 0) p.conditions = activeConditions.join(',');
    if (priceMin) p.minPrice = Number(priceMin);
    if (priceMax) p.maxPrice = Number(priceMax);
    return p;
  }, [page, sortBy, selectedCategories, activeConditions, priceMin, priceMax]);

  const {
    products: apiProducts,
    loading: productsLoading,
    error: productsError,
    total,
    totalPages,
  } = useProducts(params);

  // ── Flatten categories ──────────────────────────────────────────────────────
  const allCategories = useMemo(() => {
    const result: Category[] = [];
    const flatten = (cats: Category[]) => {
      cats.forEach((c) => {
        result.push(c);
        if (c.children?.length) flatten(c.children);
      });
    };
    flatten(apiCategories);
    return result;
  }, [apiCategories]);

  const rootCategories = allCategories.filter((c) => !c.parentId);

  // ── Reset page saat filter/sort berubah ────────────────────────────────────
  useEffect(() => {
    setPage(1);
  }, [selectedCategories, priceMin, priceMax, activeConditions, sortBy]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleNavigate = (slug: string) => navigate(`/products/${slug}`);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleCondition = (cond: string) => {
    setActiveConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setPriceMin('');
    setPriceMax('');
    setActiveConditions([]);
  };

  const saleProducts = useMemo(
    () => apiProducts.filter((p) => p.discountPercent > 0).slice(0, 3),
    [apiProducts]
  );

  // Boolean() eksplisit: `priceMin || priceMax` menghasilkan STRING, dan string
  // kosong itu falsy — jadi tanpa ini prop `hasActiveFilters` kadang berisi
  // "150000" alih-alih true.
  const hasActiveFilters = Boolean(
    selectedCategories.length > 0 || priceMin || priceMax || activeConditions.length > 0
  );

  const totalDisplay = total;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar showSearch={false} />

      <PromoCarousel
        saleProducts={saleProducts}
        loading={productsLoading}
        className="mx-auto w-full max-w-[1600px] px-5 sm:px-10 pt-6"
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 pt-5 sm:px-10">
        <NeedPayStrip />
      </div>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-5 sm:px-10 py-8">
        <div className="flex gap-8 items-start">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
            <FilterSidebar
              categories={rootCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={toggleCategory}
              categoriesLoading={catLoading}
              priceMin={priceMin}
              priceMax={priceMax}
              onPriceMinChange={setPriceMin}
              onPriceMaxChange={setPriceMax}
              conditions={CONDITIONS}
              selectedConditions={activeConditions}
              onConditionChange={toggleCondition}
              onClearAll={clearAll}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c3c6d7] text-[13px] text-[#434655] hover:border-[#004ac6] hover:text-[#004ac6] transition-colors"
                >
                  <Icon name="filter" size={14} />
                  Filter
                </button>
                <p className="text-[13px] text-[#737686]">
                  Menampilkan {productsLoading ? '...' : `${totalDisplay} produk`}
                </p>
              </div>

              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#c3c6d7] rounded-full pl-3 pr-8 py-1.5 text-[13px] text-[#191c1e] outline-none focus:border-[#004ac6] cursor-pointer transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                <Icon name="chevronDown" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737686]" />
              </div>
            </div>

            {/* Active category chips */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map((slug) => {
                  const cat = rootCategories.find((c) => c.slug === slug);
                  return (
                    <span
                      key={slug}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dbe1ff] text-[#004ac6] text-[12px] font-medium"
                    >
                      {cat?.name ?? slug}
                      <button onClick={() => toggleCategory(slug)} aria-label="Hapus filter">
                        <Icon name="close" size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Product grid */}
            {productsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden animate-pulse">
                    <div className="aspect-4/3 bg-[#f2f4f6]" />
                    <div className="p-4">
                      <div className="h-4 bg-[#f2f4f6] rounded mb-2 w-20" />
                      <div className="h-5 bg-[#f2f4f6] rounded mb-2" />
                      <div className="h-4 bg-[#f2f4f6] rounded mb-3 w-24" />
                      <div className="flex justify-between">
                        <div className="h-6 bg-[#f2f4f6] rounded w-16" />
                        <div className="w-8 h-8 rounded-full bg-[#f2f4f6]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : apiProducts.length === 0 ? (
              <div className="text-center py-20 text-[#737686]">
                {productsError ? (
                  <p>Gagal memuat produk: {productsError}</p>
                ) : (
                  <p>Tidak ada produk yang cocok dengan filter ini.</p>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {apiProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onNavigate={handleNavigate} />
                  ))}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      totalItems={total}
                      pageSize={PAGE_SIZE}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* ── Mobile Filter Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[#191c1e]">Filter</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#f2f4f6] transition-colors"
              >
                <Icon name="close" size={16} className="text-[#737686]" />
              </button>
            </div>
            <FilterSidebar
              categories={rootCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={toggleCategory}
              categoriesLoading={catLoading}
              priceMin={priceMin}
              priceMax={priceMax}
              onPriceMinChange={setPriceMin}
              onPriceMaxChange={setPriceMax}
              conditions={CONDITIONS}
              selectedConditions={activeConditions}
              onConditionChange={toggleCondition}
              onClearAll={clearAll}
              hasActiveFilters={hasActiveFilters}
            />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-4 w-full py-2.5 rounded-full bg-[#004ac6] text-white text-[14px] font-semibold hover:bg-[#003ea8] transition-colors"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CategoriesPage;