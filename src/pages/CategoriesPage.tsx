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
import Reveal from '../components/ui/Reveal';
import CategoriesEmptyState from '../components/categories/CategoriesEmptyState'

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

const stagger = (index: number, base = 50) => Math.min(index, 11) * base;

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories: apiCategories, loading: catLoading } = useCategories();
  const [page, setPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Nilai yang DIPAKAI mencari. Nilai yang sedang diketik disimpan di dalam
  // PriceRangeFilter dan baru dikirim ke sini saat user menekan Enter, jadi
  // mengetik tidak lagi menembakkan pencarian di tiap angka.
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [activeConditions, setActiveConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
      className="min-h-screen flex flex-col bg-[#f5f7fb]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <Reveal direction="up" duration={800}>
        <PromoCarousel
          saleProducts={saleProducts}
          loading={productsLoading}
          className="mx-auto w-full max-w-[1600px] px-4 pt-5 sm:px-6 sm:pt-6 lg:px-10"
        />
      </Reveal>

      <Reveal direction="up" delay={100}>
        <div className="mx-auto w-full max-w-[1600px] px-4 pt-4 sm:px-6 sm:pt-5 lg:px-10">
          <NeedPayStrip />
        </div>
      </Reveal>

      <main className="flex-1 mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="flex items-start gap-6 lg:gap-8">
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
              [&::-webkit-scrollbar-thumb]:bg-[#e0e3e5]
            "
          >
            <Reveal direction="left" duration={700}>
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
            </Reveal>
          </aside>

          <div className="min-w-0 flex-1">
            <Reveal direction="up">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6 sm:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="
                      flex items-center gap-1.5 rounded-full border
                      border-[#e0e3e5] bg-white px-3.5 py-1.5 text-[13px]
                      font-semibold text-[#101319] transition-colors
                      hover:border-[#538cbd] hover:text-[#4077a6] lg:hidden
                    "
                  >
                    <Icon name="filter" size={14} />
                    Filter
                    {hasActiveFilters && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4077a6] px-1 text-[9px] font-bold text-white">
                        {selectedCategories.length + activeConditions.length + (priceMin || priceMax ? 1 : 0)}
                      </span>
                    )}
                  </button>
                  <p className="truncate text-[12px] text-[#737686] sm:text-[13px]">
                    Menampilkan{' '}
                    {productsLoading ? '...' : `${total} produk`}
                  </p>
                </div>

                <div className="relative w-full sm:w-auto sm:shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="
                      w-full cursor-pointer appearance-none rounded-full
                      border border-[#e0e3e5] bg-white py-1.5 pl-4 pr-9
                      text-[13px] font-medium text-[#101319] outline-none
                      transition-colors focus:border-[#538cbd] sm:w-auto
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
                      -translate-y-1/2 text-[#737686]
                    "
                  />
                </div>
              </div>
            </Reveal>

            {selectedCategories.length > 0 && (
              <Reveal direction="up">
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedCategories.map((slug) => {
                    const cat = rootCategories.find((c) => c.slug === slug);
                    return (
                      <span
                        key={slug}
                        className="
                          flex items-center gap-1.5 rounded-full
                          bg-[#538cbd]/10 px-3 py-1 text-[12px] font-semibold
                          text-[#4077a6]
                        "
                      >
                        {cat?.name ?? slug}
                        <button
                          onClick={() => toggleCategory(slug)}
                          aria-label="Hapus filter"
                          className="transition-colors hover:text-[#4077a6]"
                        >
                          <Icon name="close" size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </Reveal>
            )}

            {productsLoading ? (
              <div
                className="
                  grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4
                  md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                "
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <Reveal key={i} direction="up" delay={stagger(i)} className="h-full">
                    <div
                      className="
                        h-full animate-pulse overflow-hidden rounded-2xl
                        border border-white/80 bg-white/95
                      "
                    >
                      <div className="aspect-[4/3] bg-[#F5F7FB]" />
                      <div className="p-3.5 sm:p-4">
                        <div className="mb-2 h-3 w-20 rounded-full bg-[#F5F7FB]" />
                        <div className="mb-2 h-4 rounded-full bg-[#F5F7FB]" />
                        <div className="mb-3 h-3 w-24 rounded-full bg-[#F5F7FB]" />
                        <div className="flex justify-between">
                          <div className="h-6 w-16 rounded-full bg-[#F5F7FB]" />
                          <div className="h-8 w-8 rounded-full bg-[#F5F7FB]" />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
           ) : apiProducts.length === 0 ? (
              <Reveal direction="up">
                <CategoriesEmptyState
                  variant={
                    productsError ? 'error' : hasActiveFilters ? 'no-match' : 'empty'
                  }
                  onRetry={() => navigate(0)}
                  onClearFilters={clearAll}
                  onExplore={() => navigate('/')}
                />
              </Reveal>
            ) : (
              <>
                <div
                  className="
                    grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4
                    md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                  "
                >
                  {apiProducts.map((p, index) => (
                    <Reveal
                      key={p.id}
                      direction="up"
                      delay={stagger(index)}
                      className="h-full"
                    >
                      <ProductCard product={p} onNavigate={handleNavigate} />
                    </Reveal>
                  ))}
                </div>

                {totalPages > 1 && (
                  <Reveal direction="up" className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      totalItems={total}
                      pageSize={PAGE_SIZE}
                    />
                  </Reveal>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#101319]/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div
            className="
              drawer-enter absolute bottom-0 right-0 top-0 flex w-80
              max-w-[85vw] flex-col bg-white
              shadow-[-12px_0_40px_rgba(32,36,45,0.15)]
            "
          >
            <div
              className="
                flex items-center justify-between border-b border-[#e0e3e5]
                px-5 py-4
              "
            >
              <span className="flex items-center gap-2 text-[15px] font-bold text-[#101319]">
                <span
                  className="
                    flex h-6 w-6 items-center justify-center rounded-lg
                    bg-[#538cbd]/10
                  "
                >
                  <Icon name="filter" size={13} className="text-[#4077a6]" />
                </span>
                Filter
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="
                  rounded-full p-1.5 text-[#737686] transition-colors
                  hover:bg-[#F5F7FB] hover:text-[#101319]
                "
                aria-label="Tutup filter"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

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

            <div className="border-t border-[#e0e3e5] p-4">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="
                  w-full rounded-full bg-[#4077a6] py-2.5 text-[14px]
                  font-semibold text-white
                  shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
                  hover:bg-[#4077a6] active:scale-[0.99]
                "
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @keyframes drawer-enter {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .drawer-enter {
          animation: drawer-enter 0.28s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>
    </div>
  );
};

export default CategoriesPage;