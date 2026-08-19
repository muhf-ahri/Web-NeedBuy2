import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Icon from '../components/ui/Icon';
import ProductCard from '../components/ui/ProductCard';
import CategoriesEmptyState from '../components/categories/CategoriesEmptyState';
import Reveal from '../components/ui/Reveal';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import { useCategories } from '../hooks/useCategories';
import { useCategoryDetail } from '../hooks/useCategoryDetail';
import { useProductsByCategory } from '../hooks/useProductsByCategory';
import type { Product } from '../types';

const SORT_OPTIONS = [
  'Relevansi',
  'Harga: Rendah ke Tinggi',
  'Harga: Tinggi ke Rendah',
  'Terbaru',
];
const CONDITIONS = ['Baru', 'Seperti Baru', 'Refurbished'];

const stagger = (index: number, base = 60) => Math.min(index, 11) * base;

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="border-b border-[#F5F7FB] py-4 last:border-0">
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#737686]">
      {title}
    </p>
    {children}
  </div>
);

const FilterBody: React.FC<{
  rootCategories: any[];
  currentSlug: string;
  catLoading: boolean;
  priceMin: string;
  priceMax: string;
  activeConditions: string[];
  onCategoryChange: (slug: string) => void;
  onPriceMinChange: (v: string) => void;
  onPriceMaxChange: (v: string) => void;
  onToggleCondition: (cond: string) => void;
  onClearAll: () => void;
  hasActive: boolean;
}> = ({
  rootCategories,
  currentSlug,
  catLoading,
  priceMin,
  priceMax,
  activeConditions,
  onCategoryChange,
  onPriceMinChange,
  onPriceMaxChange,
  onToggleCondition,
  onClearAll,
  hasActive,
}) => {
  const inputCls =
    'w-full rounded-lg border border-[#e0e3e5] bg-[#F5F7FB] pl-7 pr-2 py-2 text-[12px] text-[#101319] outline-none placeholder:text-[#A2A8B3] transition-all focus:border-[#004ac6] focus:bg-white focus:shadow-[0_3px_10px_rgba(83,140,219,0.10)]';

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-bold text-[#101319]">Filter</p>
        {hasActive && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-semibold text-[#004ac6] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <FilterSection title="Pindah Kategori">
        <div className="space-y-1.5">
          {catLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-28 animate-pulse rounded-full bg-[#F5F7FB]" />
              ))
            : rootCategories.map((cat) => {
                const active = cat.slug === currentSlug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => onCategoryChange(cat.slug)}
                    className="group flex w-full items-center gap-2 text-left"
                  >
                    <span
                      className={`
                        flex h-4 w-4 shrink-0 items-center justify-center
                        rounded-full border transition-colors
                        ${
                          active
                            ? 'border-[#004ac6] bg-[#004ac6]'
                            : 'border-[#e0e3e5] group-hover:border-[#004ac6]'
                        }
                      `}
                    >
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span
                      className={`
                        truncate text-[13px] transition-colors
                        ${
                          active
                            ? 'font-semibold text-[#004ac6]'
                            : 'text-[#434655] group-hover:text-[#101319]'
                        }
                      `}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
        </div>
      </FilterSection>

      <FilterSection title="Rentang Harga">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#737686]">
              Rp
            </span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
              className={`${inputCls} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </div>
          <span className="text-[11px] font-medium text-[#A2A8B3]">s/d</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#737686]">
              Rp
            </span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Maks"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              className={`${inputCls} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Kondisi">
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((cond) => {
            const active = activeConditions.includes(cond);
            return (
              <button
                key={cond}
                type="button"
                onClick={() => onToggleCondition(cond)}
                className={`
                  rounded-full border px-3 py-1.5 text-[11px] font-semibold
                  transition-all duration-200 active:scale-[0.97]
                  ${
                    active
                      ? 'border-[#004ac6] bg-[#004ac6] text-white shadow-[0_4px_12px_rgba(83,140,219,0.25)]'
                      : 'border-[#e0e3e5] bg-white text-[#434655] hover:border-[#004ac6] hover:text-[#004ac6]'
                  }
                `}
              >
                {cond}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
};

const CategoryDetailPage: React.FC = () => {
  const { slug = 'technology' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const handleNavigate = (productSlug: string) => navigate(`/products/${productSlug}`);

  const { category, loading: catLoading, notFound } = useCategoryDetail(slug);
  const { categories: allCategories } = useCategories();
  const rootCategories = allCategories.filter((c) => !c.parentId);

  const {
    products: apiProducts,
    loading: productsLoading,
    error: productsError,
    categoryName,
  } = useProductsByCategory(slug);

  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [activeConditions, setActiveConditions] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);

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

  const handleCategoryChange = (targetSlug: string) => {
    if (targetSlug !== slug) {
      navigate(`/categories/${targetSlug}`);
    }
  };

  const hasActiveFilters = Boolean(priceMin || priceMax || activeConditions.length > 0);

  const filtered = useMemo(() => {
    let list = [...apiProducts];

    if (priceMin || priceMax) {
      const min = priceMin ? parseInt(priceMin) : 0;
      const max = priceMax ? parseInt(priceMax) : Infinity;
      list = list.filter((p) => {
        const price = parseInt(p.price);
        return price >= min && price <= max;
      });
    }

    if (activeConditions.length > 0) {
      list = list.filter((p) => activeConditions.includes(p.condition ?? 'Baru'));
    }

    if (sortBy === 'Harga: Rendah ke Tinggi') {
      list.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    } else if (sortBy === 'Harga: Tinggi ke Rendah') {
      list.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    } else if (sortBy === 'Terbaru') {
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return list;
  }, [apiProducts, priceMin, priceMax, activeConditions, sortBy]);

  const pageTitle = category?.name || categoryName || slug;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f7fb]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8 lg:px-10">
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
              <div
                className="
                  rounded-[20px] border border-white/80 bg-white/95 p-4
                  shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
                "
              >
                <FilterBody
                  rootCategories={rootCategories}
                  currentSlug={slug}
                  catLoading={catLoading}
                  priceMin={priceMin}
                  priceMax={priceMax}
                  activeConditions={activeConditions}
                  onCategoryChange={handleCategoryChange}
                  onPriceMinChange={setPriceMin}
                  onPriceMaxChange={setPriceMax}
                  onToggleCondition={toggleCondition}
                  onClearAll={clearAll}
                  hasActive={hasActiveFilters}
                />
              </div>
            </Reveal>
          </aside>

          <div className="min-w-0 flex-1">
            <Reveal direction="up">
              <div className="mb-6">
                <Link
                  to="/categories"
                  className="
                    mb-2 inline-flex items-center gap-1.5 rounded-full
                    bg-white px-3 py-1.5 text-[12px] font-semibold
                    text-[#737686] shadow-sm transition-all duration-200
                    hover:text-[#004ac6]
                    hover:shadow-[0_4px_12px_rgba(83,140,219,0.12)]
                  "
                >
                  <Icon name="arrowLeft" size={13} />
                  Semua Kategori
                </Link>

                {catLoading ? (
                  <div className="mt-2 space-y-2">
                    <div className="h-7 w-56 animate-pulse rounded-full bg-[#e0e3e5]" />
                    <div className="h-3 w-80 animate-pulse rounded-full bg-[#e0e3e5]" />
                  </div>
                ) : notFound ? (
                  <h1 className="mt-2 text-[22px] font-bold text-[#ba1a1a] sm:text-[26px]">
                    Kategorinya nggak ketemu
                  </h1>
                ) : (
                  <>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className="
                          inline-flex items-center gap-1.5 rounded-full
                          bg-[#004ac6]/10 px-2.5 py-1
                        "
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                        <p
                          className="
                            text-[9px] font-bold uppercase tracking-[0.20em]
                            text-[#004ac6]
                          "
                        >
                          Kategori
                        </p>
                      </span>
                    </div>
                    <h1
                      className="
                        mt-2 text-[24px] font-extrabold leading-tight
                        tracking-tight text-[#101319] sm:text-[28px]
                      "
                    >
                      {pageTitle}
                    </h1>
                    {category?.description && (
                      <p className="mt-1.5 max-w-2xl text-[13px] text-[#737686]">
                        {category.description}
                      </p>
                    )}
                  </>
                )}
              </div>
            </Reveal>

            <Reveal direction="up">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(true)}
                    className="
                      flex items-center gap-1.5 rounded-full border
                      border-[#e0e3e5] bg-white px-3.5 py-1.5 text-[13px]
                      font-semibold text-[#101319] transition-colors
                      hover:border-[#004ac6] hover:text-[#004ac6] lg:hidden
                    "
                  >
                    <Icon name="filter" size={14} />
                    Filter
                    {hasActiveFilters && (
                      <span
                        className="
                          flex h-4 min-w-4 items-center justify-center
                          rounded-full bg-[#004ac6] px-1 text-[9px]
                          font-bold text-white
                        "
                      >
                        {activeConditions.length + (priceMin || priceMax ? 1 : 0)}
                      </span>
                    )}
                  </button>
                  <p className="truncate text-[12px] text-[#737686] sm:text-[13px]">
                    Menampilkan{' '}
                    {productsLoading ? '...' : `${filtered.length} produk`}
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
                      transition-colors focus:border-[#004ac6] sm:w-auto
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
                      <div className="space-y-2 p-3.5">
                        <div className="h-3 w-20 rounded-full bg-[#F5F7FB]" />
                        <div className="h-4 rounded-full bg-[#F5F7FB]" />
                        <div className="h-3 w-24 rounded-full bg-[#F5F7FB]" />
                        <div className="flex justify-between">
                          <div className="h-6 w-16 rounded-full bg-[#F5F7FB]" />
                          <div className="h-8 w-8 rounded-full bg-[#F5F7FB]" />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Reveal direction="up">
                <CategoriesEmptyState
                  variant={
                    productsError
                      ? 'error'
                      : hasActiveFilters
                        ? 'no-match'
                        : 'detail-empty'
                  }
                  onRetry={() => navigate(0)}
                  onClearFilters={clearAll}
                  onExplore={() => navigate('/')}
                  onBack={() => navigate('/categories')}
                />
              </Reveal>
            ) : (
              <div
                className="
                  grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4
                  md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                "
              >
                {filtered.map((p: Product, index) => (
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
            <div className="flex items-center justify-between border-b border-[#e0e3e5] px-5 py-4">
              <span className="flex items-center gap-2 text-[15px] font-bold text-[#101319]">
                <span
                  className="
                    flex h-6 w-6 items-center justify-center rounded-lg
                    bg-[#004ac6]/10
                  "
                >
                  <Icon name="filter" size={13} className="text-[#004ac6]" />
                </span>
                Filter
              </span>
              <button
                type="button"
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
              <FilterBody
                rootCategories={rootCategories}
                currentSlug={slug}
                catLoading={catLoading}
                priceMin={priceMin}
                priceMax={priceMax}
                activeConditions={activeConditions}
                onCategoryChange={(s) => {
                  handleCategoryChange(s);
                  setMobileFilterOpen(false);
                }}
                onPriceMinChange={setPriceMin}
                onPriceMaxChange={setPriceMax}
                onToggleCondition={toggleCondition}
                onClearAll={clearAll}
                hasActive={hasActiveFilters}
              />
            </div>

            <div className="border-t border-[#e0e3e5] p-4">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="
                  w-full rounded-full bg-[#004ac6] py-2.5 text-[14px]
                  font-semibold text-white
                  shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
                  hover:bg-[#004ac6] active:scale-[0.99]
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

export default CategoryDetailPage;