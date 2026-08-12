// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SaleRail from '../components/layout/SaleRail';
import Icon, { type IconName } from '../components/ui/Icon';
import SearchSuggestions from '../components/ui/SearchSuggestions';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../types';

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

// ─── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <div
    className={`bg-[#eceef0] rounded-2xl p-5 min-h-35 animate-pulse ${wide ? 'sm:col-span-2' : ''}`}
  >
    <div className="w-9 h-9 bg-[#d8dadc] rounded-xl mb-auto" />
    <div className="mt-auto space-y-2 pt-8">
      <div className="h-4 w-24 bg-[#d8dadc] rounded-full" />
      <div className="h-3 w-40 bg-[#d8dadc] rounded-full" />
    </div>
  </div>
);

// ─── Category Card ─────────────────────────────────────────────────────────────
const CategoryCard: React.FC<{ category: Category; index: number }> = ({ category, index }) => {
  const iconName = getCategoryIcon(category.name, category.slug);
  // Alternate wide layout for visual interest — 1st and 4th card are wide
  const isWide = index === 0 || index === 3;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`
        group relative bg-[#eceef0] hover:bg-[#e0e3e5] rounded-2xl p-5
        flex flex-col justify-between min-h-35
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm
        ${isWide ? 'sm:col-span-2' : ''}
      `}
    >
      {/* Top row: icon */}
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-xl bg-white/60">
          <Icon name={iconName} size={20} className="text-[#004ac6]" />
        </div>
      </div>

      {/* Bottom: name + description */}
      <div className="mt-4">
        <h3 className="text-[15px] font-bold text-[#004ac6] leading-tight">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-0.5 text-[13px] text-[#434655] leading-snug line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const { categories, loading, error } = useCategories();

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Show root-level categories only (no parentId)
  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <div
      className="min-h-screen flex flex-col bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      {/* ── Hero Section ───────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-10 pt-16 pb-20 max-w-6xl mx-auto w-full">
        <div className="max-w-lg">
          <h1 className="text-[42px] sm:text-[52px] font-bold text-[#004ac6] leading-[1.1] tracking-tight">
            Buy What You Need,{' '}
            <br />
            Not What You See.
          </h1>

          <p className="mt-5 text-[15px] text-[#434655] leading-relaxed max-w-sm">
            State your necessity. We filter the noise, find the optimal match,
            and present you with exactly what you require. No endless scrolling.
            No impulse buys. Just precision utility.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative mt-8 flex items-center gap-2 bg-white rounded-full border border-[#c3c6d7] px-4 py-2 shadow-sm max-w-md focus-within:border-[#004ac6] focus-within:ring-2 focus-within:ring-[#004ac6]/15 transition-all"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSuggestOpen(true);
              }}
              onFocus={() => setSuggestOpen(true)}
              onBlur={() => setSuggestOpen(false)}
              onKeyDown={(e) => { if (e.key === 'Escape') setSuggestOpen(false); }}
              placeholder="I need a laptop for video editing under Rp15.000.000..."
              className="flex-1 bg-transparent outline-none text-[13px] text-[#191c1e] placeholder-[#737686] min-w-0"
            />
            <button
              type="submit"
              className="shrink-0 w-9 h-9 rounded-full bg-[#004ac6] hover:bg-[#003ea8] transition-colors flex items-center justify-center"
              aria-label="Cari"
            >
              <Icon name="arrowRight" size={16} className="text-white" />
            </button>

            {suggestOpen && (
              <SearchSuggestions term={searchQuery} onPick={() => setSuggestOpen(false)} />
            )}
          </form>
        </div>
      </section>

      {/* ── Sale rail ──────────────────────────────────────────────────────────── */}
      <SaleRail />

      {/* ── Essentials Section ─────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-10 pb-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#191c1e]">Essentials</h2>
          <Link
            to="/categories"
            className="text-[13px] text-[#434655] hover:text-[#004ac6] transition-colors"
          >
            View Directory
          </Link>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <span className="text-[13px] text-[#93000a]">{error}</span>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {loading
            ? // Skeleton placeholders
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} wide={i === 0 || i === 3} />
              ))
            : rootCategories.map((cat, index) => (
                <CategoryCard key={cat.id} category={cat} index={index} />
              ))}
        </div>

        {/* Empty state (API returned no categories) */}
        {!loading && !error && rootCategories.length === 0 && (
          <div className="text-center py-12 text-[#737686] text-[14px]">
            Belum ada kategori tersedia.
          </div>
        )}
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
