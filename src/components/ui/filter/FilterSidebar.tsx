// src/components/ui/filter/FilterSidebar.tsx
import React from 'react';
import CategoryFilter from './CategoryFilter';
import ConditionFilter from './ConditionFilter';
import PriceRangeFilter from './PriceRangeFilter';
import type { Category } from '../../../types';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (slug: string) => void;
  categoriesLoading?: boolean;

  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;

  conditions: string[];
  selectedConditions: string[];
  onConditionChange: (condition: string) => void;

  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  categoriesLoading = false,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  conditions,
  selectedConditions,
  onConditionChange,
  onClearAll,
  hasActiveFilters,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[15px] font-bold text-[#191c1e]">Filter</h2>
        {hasActiveFilters && (
          <button onClick={onClearAll} className="text-[12px] text-[#004ac6] hover:underline">
            Hapus Semua
          </button>
        )}
      </div>

      <div className="py-4 border-b border-[#e0e3e5]">
        <p className="text-[11px] font-bold text-[#737686] uppercase tracking-wider mb-3">Kategori</p>
        <CategoryFilter
          categories={categories}
          selected={selectedCategories}
          onChange={onCategoryChange}
          loading={categoriesLoading}
        />
      </div>

      <div className="py-4 border-b border-[#e0e3e5]">
        <p className="text-[11px] font-bold text-[#737686] uppercase tracking-wider mb-3">Rentang Harga</p>
        <PriceRangeFilter
          minValue={priceMin}
          maxValue={priceMax}
          onMinChange={onPriceMinChange}
          onMaxChange={onPriceMaxChange}
        />
      </div>

      <div className="py-4 border-b border-[#e0e3e5] last:border-0">
        <p className="text-[11px] font-bold text-[#737686] uppercase tracking-wider mb-3">Kondisi</p>
        <ConditionFilter
          options={conditions}
          selected={selectedConditions}
          onChange={onConditionChange}
        />
      </div>
    </div>
  );
};

export default FilterSidebar;