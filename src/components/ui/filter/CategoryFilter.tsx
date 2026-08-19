import React from 'react';

import Icon from '../../ui/Icon';
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
      <div className="space-y-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="
              flex h-9 items-center gap-2.5 rounded-xl bg-[#F5F7FB]
              animate-pulse
            "
          >
            <div className="ml-2.5 h-4 w-4 shrink-0 rounded-md bg-[#e0e3e5]" />
            <div className="h-2.5 w-24 rounded-full bg-[#e0e3e5]" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="py-3 text-center text-[11px] text-[#A2A8B3]">
        Belum ada kategori.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {categories.map((cat) => {
        const active = selected.includes(cat.slug);
        return (
          <button
            key={cat.slug}
            type="button"
            onClick={() => onChange(cat.slug)}
            className={`
              group flex w-full items-center gap-2.5 rounded-xl px-2.5
              py-2 text-left transition-all duration-200
              ${
                active
                  ? 'bg-[#004ac6]/10'
                  : 'hover:bg-[#F5F7FB]'
              }
            `}
          >
            <span
              className={`
                relative flex h-4 w-4 shrink-0 items-center justify-center
                rounded-md border transition-all duration-200
                ${
                  active
                    ? 'border-[#004ac6] bg-[#004ac6]'
                    : 'border-[#e0e3e5] bg-white group-hover:border-[#004ac6]/60'
                }
              `}
            >
              {active && <Icon name="check" size={11} className="text-white" />}
            </span>

            <span
              className={`
                min-w-0 flex-1 truncate text-[13px] transition-colors
                duration-200
                ${
                  active
                    ? 'font-semibold text-[#004ac6]'
                    : 'font-medium text-[#101319] group-hover:text-[#004ac6]'
                }
              `}
            >
              {cat.name}
            </span>

            {active && (
              <span
                className="
                  h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD500]
                  transition-opacity duration-200
                "
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;