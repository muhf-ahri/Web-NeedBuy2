import React from 'react';
import type { Category } from '../../../types';

interface CategoryFilterProps {
  categories: Category[];
  selected: string[];
  onChange: (slug: string) => void;
  loading?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onChange,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-[#e0e3e5] rounded-full animate-pulse w-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((cat) => {
        const active = selected.includes(cat.slug);
        return (
          <button
            key={cat.slug}
            onClick={() => onChange(cat.slug)}
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
  );
};

export default CategoryFilter;