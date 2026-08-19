import React from 'react';

import Icon from '../ui/Icon';

const SORT_OPTIONS = [
  { label: 'Relevansi', value: undefined },
  { label: 'Harga: Rendah ke Tinggi', value: 'price_asc' },
  { label: 'Harga: Tinggi ke Rendah', value: 'price_desc' },
  { label: 'Terbaru', value: 'newest' },
  { label: 'Rating Tertinggi', value: 'rating' },
  { label: 'Terlaris', value: 'sold' },
] as const;

interface SearchToolbarProps {
  sort: string;
  onSortChange: (v: string) => void;
  summary: string;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({
  sort,
  onSortChange,
  summary,
}) => (
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
    <p className="text-[13px] text-[#737686]">{summary}</p>

    <div className="relative shrink-0">
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="
          cursor-pointer appearance-none rounded-full border border-[#e0e3e5]
          bg-white py-1.5 pl-4 pr-9 text-[13px] font-medium text-[#101319]
          outline-none transition-colors focus:border-[#538cbd]
        "
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.label}>{opt.label}</option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        size={14}
        className="
          pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
          text-[#737686]
        "
      />
    </div>
  </div>
);

export { SORT_OPTIONS };
export default SearchToolbar;