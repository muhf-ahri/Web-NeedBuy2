import React from 'react';

import Icon from '../Icon';
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

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    className="
      mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase
      tracking-[0.16em] text-[#737A87]
    "
  >
    <span className="h-1 w-1 rounded-full bg-[#FFD500]" />
    {children}
  </p>
);

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
      
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#20242D]">
          <span
            className="
              flex h-7 w-7 items-center justify-center rounded-lg
              bg-[#538CDB]/10
            "
          >
            <Icon name="filter" size={14} className="text-[#538CDB]" />
          </span>
          Filter
        </h2>

        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="
              text-[11px] font-semibold text-[#538CDB] transition-colors
              hover:text-[#467BC7] hover:underline
            "
          >
            Hapus Semua
          </button>
        )}
      </div>

      <div className="border-b border-[#E8ECF4] py-4">
        <SectionTitle>Kategori</SectionTitle>
        <CategoryFilter
          categories={categories}
          selected={selectedCategories}
          onChange={onCategoryChange}
          loading={categoriesLoading}
        />
      </div>

      <div className="border-b border-[#E8ECF4] py-4">
        <SectionTitle>Rentang Harga</SectionTitle>
        <PriceRangeFilter
          minValue={priceMin}
          maxValue={priceMax}
          onMinChange={onPriceMinChange}
          onMaxChange={onPriceMaxChange}
        />
      </div>

      <div className="py-4">
        <SectionTitle>Kondisi</SectionTitle>
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