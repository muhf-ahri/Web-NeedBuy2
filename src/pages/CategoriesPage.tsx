import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
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

// Batas maksimal backend adalah 100 per halaman; halaman ini memuat semuanya
// dan menambahkan tombol "muat lebih banyak" untuk halaman berikutnya.
const ALL_PRODUCTS_PARAMS: GetProductsParams = { limit: 100 };

/** Kumpulkan slug kategori terpilih + seluruh turunannya (produk hanya menempel di kategori daun). */
const collectCategoryAndDescendants = (categories: Category[], slug: string): Set<string> => {
  const result = new Set<string>();
  const visit = (cat: Category) => {
    if (result.has(cat.slug)) return;
    result.add(cat.slug);
    cat.children?.forEach(visit);
  };
  const start = categories.find((c) => c.slug === slug);
  if (start) visit(start);
  return result;
};

const ProductCard: React.FC<{ product: Product; onNavigate: (slug: string) => void }> = ({ product, onNavigate }) => {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refreshCartCount } = useCart();
  const { saved: wishlisted, busy: wishlistBusy, toggle: toggleWishlist } = useWishlist(product.id);
  const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';

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
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistBusy}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label="Simpan ke wishlist"
        >
          <Icon name="heart" size={14} className={`transition-colors ${wishlisted ? 'text-[#004ac6]' : 'text-[#737686]'}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-semibold text-[#004ac6] uppercase tracking-wide mb-1">
          {product.seller.storeName}
        </span>
        <h3 className="text-[14px] font-semibold text-[#191c1e] leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.floor(parseFloat(product.rating)) ? 'text-[#ffb020] fill-[#ffb020]' : 'text-[#c3c6d7] fill-[#c3c6d7]'}`} viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.192L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-[#737686]">({product.rating})</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-bold text-[#004ac6]">
              {formatRupiah(product.price)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-[#191c1e] hover:bg-[#004ac6] text-white flex items-center justify-center transition-colors duration-200"
            aria-label="Tambah ke keranjang"
          >
            {added ? <Icon name="check" size={14} className="" /> : <Icon name="cart" size={14} className="" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4 border-b border-[#e0e3e5] last:border-0">
    <p className="text-[11px] font-bold text-[#737686] uppercase tracking-wider mb-3">{title}</p>
    {children}
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────
const CategoriesPage: React.FC = () => {
  // ── Hooks first (all state) ──────────────────────────────────────────────
  const { categories: apiCategories, loading: catLoading } = useCategories();
  const {
    products: apiProducts,
    loading: productsLoading,
    error: productsError,
    hasMore,
    loadMore,
  } = useProducts(ALL_PRODUCTS_PARAMS);
  const navigate = useNavigate();

  const handleNavigate = (slug: string) => navigate(`/products/${slug}`);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [activeConditions, setActiveConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // ── Computed values (after hooks) ───────────────────────────────────────
  // Flatten entire tree so selecting a parent also shows products in sub-categories
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

  // Filter + sort API products
  const filtered = useMemo(() => {
    let list = [...apiProducts];

    if (selectedCategories.length > 0) {
      const matchedSlugs = new Set<string>();
      selectedCategories.forEach((slug) => {
        collectCategoryAndDescendants(allCategories, slug).forEach((s) => matchedSlugs.add(s));
      });
      list = list.filter((p) => matchedSlugs.has(p.category.slug));
    }

    // Apply price filter
    if (priceMin || priceMax) {
      const min = priceMin ? parseInt(priceMin) : 0;
      const max = priceMax ? parseInt(priceMax) : Infinity;
      list = list.filter((p) => {
        const price = parseInt(p.price);
        return price >= min && price <= max;
      });
    }

    // Kondisi: tanpa pilihan berarti semua kondisi ikut tampil.
    if (activeConditions.length > 0) {
      list = list.filter((p) => activeConditions.includes(p.condition ?? 'Baru'));
    }

    // Apply sort
    if (sortBy === 'Harga: Rendah ke Tinggi') {
      list.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    } else if (sortBy === 'Harga: Tinggi ke Rendah') {
      list.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    } else if (sortBy === 'Terbaru') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [apiProducts, allCategories, selectedCategories, priceMin, priceMax, activeConditions, sortBy]);

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

  // Elemen, BUKAN komponen. Ditulis sebagai `const Sidebar = () => ...`, React
  // melihat tipe komponen baru tiap render lalu me-remount seluruh isinya —
  // itu yang bikin input harga kehilangan fokus tiap satu ketikan.
  const sidebar = (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[15px] font-bold text-[#191c1e]">Filter</h2>
        {(selectedCategories.length > 0 || priceMin || priceMax || activeConditions.length > 0) && (
          <button onClick={clearAll} className="text-[12px] text-[#004ac6] hover:underline">
            Clear All
          </button>
        )}
      </div>

      <FilterSection title="Kategori">
        {catLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-[#e0e3e5] rounded-full animate-pulse w-32" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {rootCategories.map((cat) => {
              const active = selectedCategories.includes(cat.slug);
              return (
                <button
                  key={cat.slug}
                  onClick={() => toggleCategory(cat.slug)}
                  className="flex items-center gap-2 w-full text-left group"
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                      active ? 'border-[#004ac6] bg-[#004ac6]' : 'border-[#c3c6d7] group-hover:border-[#004ac6]'
                    }`}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span
                    className={`text-[13px] transition-colors ${
                      active ? 'text-[#004ac6] font-semibold' : 'text-[#434655] group-hover:text-[#191c1e]'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </FilterSection>

      <FilterSection title="Rentang Harga">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#737686]">Rp</span>
            <input
              type="number"
              placeholder="0"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-[12px] border border-[#c3c6d7] rounded-lg outline-none focus:border-[#004ac6] transition-colors"
            />
          </div>
          <span className="text-[#737686] text-[12px]">–</span>
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#737686]">Rp</span>
            <input
              type="number"
              placeholder="Maks"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-[12px] border border-[#c3c6d7] rounded-lg outline-none focus:border-[#004ac6] transition-colors"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Kondisi">
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              onClick={() => toggleCondition(cond)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors duration-200 ${
                activeConditions.includes(cond)
                  ? 'bg-[#191c1e] text-white border-[#191c1e]'
                  : 'bg-white text-[#434655] border-[#c3c6d7] hover:border-[#004ac6] hover:text-[#004ac6]'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <div className="flex gap-8 items-start">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
            {sidebar}
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c3c6d7] text-[13px] text-[#434655] hover:border-[#004ac6] hover:text-[#004ac6] transition-colors"
                >
                  <Icon name="filter" size={14} className="" />
                  Filters
                </button>
                <p className="text-[13px] text-[#737686]">
                  Menampilkan {productsLoading ? '...' : `${filtered.length} produk`}
                </p>
              </div>

              {/* Sort */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#c3c6d7] rounded-full pl-3 pr-8 py-1.5 text-[13px] text-[#191c1e] outline-none focus:border-[#004ac6] cursor-pointer transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
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
                        <Icon name="close" size={12} className="" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Product grid */}
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
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
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-[#737686]">
                {productsError ? (
                  <p>Gagal memuat produk: {productsError}</p>
                ) : (
                  <p>Nggak ada produk yang cocok sama filter ini.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p) => <ProductCard key={p.id} product={p} onNavigate={handleNavigate} />)}
              </div>
            )}

            {!productsLoading && filtered.length > 0 && hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={async () => {
                    setLoadingMore(true);
                    try {
                      await loadMore();
                    } catch {
                      // error load more cukup tampil di console; data yang ada tetap utuh
                    } finally {
                      setLoadingMore(false);
                    }
                  }}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-full border border-[#c3c6d7] text-[13px] text-[#191c1e] hover:border-[#004ac6] hover:text-[#004ac6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Sabar ya...' : 'Muat Lagi'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Mobile Filter Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
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
            {sidebar}
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
