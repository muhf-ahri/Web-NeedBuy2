import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../components/ui/Icon';
import { NeedPayStrip } from '../components/ui/NeedPayNote';
import Pagination from '../components/ui/Pagination';
import FilterSidebar from '../components/ui/filter/FilterSidebar';
import Navbar from '../components/layout/Navbar';
import PromoCarousel from '../components/layout/PromoCarousel';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';

import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';

import type { GetProductsParams } from '../api/products';
import type { Category } from '../types';

const SORT_OPTIONS = [
  'Paling Cocok',
  'Harga: Rendah ke Tinggi',
  'Harga: Tinggi ke Rendah',
  'Terbaru',
];
const CONDITIONS = ['Baru', 'Seperti Baru', 'Refurbished'];

const PAGE_SIZE = 24;

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

  /* ── Kunci scroll body saat drawer filter mobile terbuka ── */
  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);

  const params: GetProductsParams = useMemo(() => {
    const p: GetProductsParams = { limit: PAGE_SIZE, page };
    if (sortBy === 'Harga: Rendah ke Tinggi') p.sort = 'price_asc';
    else if (sortBy === 'Harga: Tinggi ke Rendah') p.sort = 'price_desc';
    else if (sortBy === 'Terbaru') p.sort = 'newest';

    if (selectedCategories.length > 0)
      p.categorySlugs = selectedCategories.join(',');
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

  useEffect(() => {
    setPage(1);
  }, [selectedCategories, priceMin, priceMax, activeConditions, sortBy]);

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

  const hasActiveFilters = Boolean(
    selectedCategories.length > 0 ||
      priceMin ||
      priceMax ||
      activeConditions.length > 0
  );

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F5F5FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <PromoCarousel
        saleProducts={saleProducts}
        loading={productsLoading}
        className="mx-auto w-full max-w-[1600px] px-5 pt-6 sm:px-10"
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 pt-5 sm:px-10">
        <NeedPayStrip />
      </div>

      <main className="flex-1 mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-10">
        <div className="flex items-start gap-8">
          {/* ── Desktop Sidebar — sticky + scroll independen ── */}
          <aside
            className="
              sticky top-24 hidden w-60 shrink-0 lg:block
              max-h-[calc(100vh-7.5rem)] overflow-y-auto overscroll-contain
              pb-2 pr-2
              [scrollbar-width:thin]
              [scrollbar-color:#D8DEE9_transparent]
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-[#D8DEE9]
            "
          >
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
          <div className="min-w-0 flex-1">
            {/* Top bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="
                    flex items-center gap-1.5 rounded-full border
                    border-[#E8ECF4] bg-white px-3.5 py-1.5 text-[13px]
                    font-semibold text-[#20242D] transition-colors
                    hover:border-[#538CDB] hover:text-[#538CDB] lg:hidden
                  "
                >
                  <Icon name="filter" size={14} />
                  Filter
                </button>
                <p className="text-[13px] text-[#737A87]">
                  Menampilkan{' '}
                  {productsLoading ? '...' : `${total} produk`}
                </p>
              </div>

              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="
                    cursor-pointer appearance-none rounded-full border
                    border-[#E8ECF4] bg-white py-1.5 pl-4 pr-9 text-[13px]
                    font-medium text-[#20242D] outline-none transition-colors
                    focus:border-[#538CDB]
                  "
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                <Icon
                  name="chevronDown"
                  size={14}
                  className="
                    pointer-events-none absolute right-3 top-1/2
                    -translate-y-1/2 text-[#737A87]
                  "
                />
              </div>
            </div>

            {/* Active category chips */}
            {selectedCategories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCategories.map((slug) => {
                  const cat = rootCategories.find((c) => c.slug === slug);
                  return (
                    <span
                      key={slug}
                      className="
                        flex items-center gap-1.5 rounded-full
                        bg-[#538CDB]/10 px-3 py-1 text-[12px] font-semibold
                        text-[#538CDB]
                      "
                    >
                      {cat?.name ?? slug}
                      <button
                        onClick={() => toggleCategory(slug)}
                        aria-label="Hapus filter"
                        className="transition-colors hover:text-[#467BC7]"
                      >
                        <Icon name="close" size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Product grid */}
            {productsLoading ? (
              <div
                className="
                  grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4
                  xl:grid-cols-5 2xl:grid-cols-6
                "
              >
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div
                    key={i}
                    className="
                      animate-pulse overflow-hidden rounded-2xl border
                      border-white/80 bg-white/95
                    "
                  >
                    <div className="aspect-[4/3] bg-[#F5F7FB]" />
                    <div className="p-4">
                      <div className="mb-2 h-3 w-20 rounded-full bg-[#F5F7FB]" />
                      <div className="mb-2 h-4 rounded-full bg-[#F5F7FB]" />
                      <div className="mb-3 h-3 w-24 rounded-full bg-[#F5F7FB]" />
                      <div className="flex justify-between">
                        <div className="h-6 w-16 rounded-full bg-[#F5F7FB]" />
                        <div className="h-8 w-8 rounded-full bg-[#F5F7FB]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : apiProducts.length === 0 ? (
              <div className="py-20 text-center">
                <div
                  className="
                    mx-auto flex h-14 w-14 items-center justify-center
                    rounded-full bg-white shadow-[0_8px_24px_rgba(32,36,45,0.06)]
                  "
                >
                  <Icon name="search" size={22} className="text-[#A2A8B3]" />
                </div>
                <p className="mt-4 text-[14px] font-semibold text-[#20242D]">
                  {productsError
                    ? 'Gagal memuat produk'
                    : 'Tidak ada produk yang cocok'}
                </p>
                <p className="mt-1 text-[12px] text-[#737A87]">
                  {productsError
                    ? productsError
                    : 'Coba ubah atau hapus beberapa filter.'}
                </p>
              </div>
            ) : (
              <>
                <div
                  className="
                    grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4
                    xl:grid-cols-5 2xl:grid-cols-6
                  "
                >
                  {apiProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>

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
          <div
            className="absolute inset-0 bg-[#20242D]/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div
            className="
              absolute bottom-0 right-0 top-0 flex w-80 max-w-[85vw]
              flex-col bg-white shadow-[-12px_0_40px_rgba(32,36,45,0.15)]
            "
          >
            {/* Header drawer */}
            <div
              className="
                flex items-center justify-between border-b border-[#E8ECF4]
                px-5 py-4
              "
            >
              <span className="flex items-center gap-2 text-[15px] font-bold text-[#20242D]">
                <span
                  className="
                    flex h-6 w-6 items-center justify-center rounded-lg
                    bg-[#538CDB]/10
                  "
                >
                  <Icon name="filter" size={13} className="text-[#538CDB]" />
                </span>
                Filter
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="
                  rounded-full p-1.5 text-[#737A87] transition-colors
                  hover:bg-[#F5F7FB] hover:text-[#20242D]
                "
                aria-label="Tutup filter"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            {/* Scroll area drawer */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
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
            </div>

            {/* Footer drawer — sticky */}
            <div className="border-t border-[#E8ECF4] p-4">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="
                  w-full rounded-full bg-[#538CDB] py-2.5 text-[14px]
                  font-semibold text-white
                  shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
                  hover:bg-[#467BC7] active:scale-[0.99]
                "
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CategoriesPage;