import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import DiscountBadge, { PriceWithDiscount } from '../components/ui/DiscountBadge';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCategories } from '../hooks/useCategories';
import { useCategoryDetail } from '../hooks/useCategoryDetail';
import { useProductsByCategory } from '../hooks/useProductsByCategory';
import { addToCart } from '../api/cart';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../hooks/useWishlist';
import type { Product } from '../types';

const SORT_OPTIONS = ['Relevansi', 'Harga: Rendah ke Tinggi', 'Harga: Tinggi ke Rendah', 'Terbaru'];
const CONDITIONS = ['Baru', 'Seperti Baru', 'Refurbished'];

// ─── Sub-components ────────────────────────────────────────────────────────────

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
const CategoryDetailPage: React.FC = () => {
  const { slug = 'technology' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const handleNavigate = (productSlug: string) => navigate(`/products/${productSlug}`);

  // Fetch category detail from API
  const { category, loading: catLoading, notFound } = useCategoryDetail(slug);
  // Fetch all categories for sidebar
  const { categories: allCategories } = useCategories();
  const rootCategories = allCategories.filter((c) => !c.parentId);
  
  // Fetch products by category from API
  const { products: apiProducts, loading: productsLoading, error: productsError, categoryName } = useProductsByCategory(slug);
  
  // Filter state
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [activeConditions, setActiveConditions] = useState<string[]>([]);

  const toggleCondition = (cond: string) => {
    setActiveConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const clearAll = () => {
    setPriceMin('');
    setPriceMax('');
    setActiveConditions([]);
  };

  // Navigate to different category when filter radio clicked
  const handleCategoryChange = (targetSlug: string) => {
    if (targetSlug !== slug) {
      navigate(`/categories/${targetSlug}`);
    }
  };

  // Apply price filter + sort to API products
  const filtered = useMemo(() => {
    let list = [...apiProducts];
    
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
  }, [apiProducts, priceMin, priceMax, activeConditions, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-5 sm:px-10 py-8">
        <div className="flex gap-8 items-start">

          {/* ── Filter Sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[15px] font-bold text-[#191c1e]">Filter</h2>
              {(priceMin || priceMax || activeConditions.length > 0) && (
                <button onClick={clearAll} className="text-[12px] text-[#004ac6] hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {/* Category radio — navigates to the selected category */}
            <FilterSection title="Kategori">
              <div className="space-y-2">
                {rootCategories.length === 0
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-4 bg-[#e0e3e5] rounded-full animate-pulse w-28" />
                    ))
                  : rootCategories.map((cat) => {
                      const active = cat.slug === slug;
                      return (
                        <button
                          key={cat.slug}
                          onClick={() => handleCategoryChange(cat.slug)}
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
            </FilterSection>

            {/* Price range filter */}
            <FilterSection title="Rentang Harga">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#737686]">Rp</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-[12px] border border-[#c3c6d7] rounded-lg outline-none focus:border-[#004ac6] transition-colors"
                  />
                </div>
                <span className="text-[#737686] text-[12px]">–</span>
                <div className="flex-1 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#737686]">Rp</span>
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

            {/* Condition */}
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
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#434655] hover:text-[#004ac6] transition-colors mb-2"
                >
                  <Icon name="arrowLeft" size={14} className="" />
                  Semua Kategori
                </Link>
                {catLoading ? (
                  <div className="h-6 w-40 bg-[#e0e3e5] rounded-full animate-pulse mt-1" />
                ) : notFound ? (
                  <h1 className="text-[22px] font-bold text-[#ba1a1a]">Kategorinya nggak ketemu</h1>
                ) : (
                  <>
                    <h1 className="text-[22px] font-bold text-[#191c1e]">
                      {category?.name || categoryName || slug}
                    </h1>
                    {category?.description && (
                      <p className="text-[13px] text-[#737686] mt-0.5">{category.description}</p>
                    )}
                  </>
                )}
                <p className="text-[13px] text-[#737686] mt-1">
                  Menampilkan {productsLoading ? '...' : `${filtered.length} hasil`}
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

            {/* Product grid */}
            {productsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {filtered.map((p) => <ProductCard key={p.id} product={p} onNavigate={handleNavigate} />)}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryDetailPage;
