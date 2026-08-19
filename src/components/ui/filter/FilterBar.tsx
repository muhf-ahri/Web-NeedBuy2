import React, { useState } from 'react';
import Icon from '../Icon';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label?: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

interface FilterBarProps {
  filters: FilterConfig[];
  onMoreFilters?: () => void;
  moreFiltersLabel?: string;
  className?: string;

  visibleFilters?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onMoreFilters,
  moreFiltersLabel = 'More Filters',
  className = '',
  visibleFilters = 3,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);

  const handleFilterChange = (filter: FilterConfig, value: string) => {
    filter.onChange(value);

    setClickedId(filter.key);
    setTimeout(() => setClickedId(null), 300);
  };

  const handleMoreClick = () => {
    setIsMoreOpen(!isMoreOpen);
    if (onMoreFilters) onMoreFilters();
  };

  const visibleFiltersList = filters.slice(0, visibleFilters);
  const hiddenFilters = filters.slice(visibleFilters);

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {visibleFiltersList.map((filter) => {
        const isActive = filter.value !== filter.options[0]?.value;
        const isClicked = clickedId === filter.key;

        return (
          <div key={filter.key} className="relative">
            <select
              value={filter.value}
              onChange={(e) => handleFilterChange(filter, e.target.value)}
              className={`
                appearance-none px-4 py-2.5 pr-9 rounded-xl text-sm font-medium
                border transition-all duration-200 ease-out
                bg-white cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-[#004ac6]/30
                ${isActive
                  ? 'border-[#004ac6] text-[#004ac6] bg-[#f5f7fb]'
                  : 'border-[#c3c6d7] text-[#434655] hover:border-[#004ac6] hover:bg-[#f5f7fb]'
                }
                ${isClicked ? 'scale-95' : ''}
                ${filter.className || ''}
              `}
              style={{
                transform: isClicked ? 'scale(0.95)' : 'scale(1)',
              }}
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div
              className={`
                absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
                transition-transform duration-200
                ${isActive ? 'text-[#004ac6]' : 'text-[#737686]'}
              `}
            >
              <Icon name="chevronDown" size={14} />
            </div>
          </div>
        );
      })}

      {hiddenFilters.length > 0 && (
        <div className="relative">
          <button
            onClick={handleMoreClick}
            className={`
              px-4 py-2.5 rounded-xl text-sm font-medium
              border transition-all duration-200 ease-out
              ${isMoreOpen
                ? 'border-[#004ac6] text-[#004ac6] bg-[#f5f7fb]'
                : 'border-[#c3c6d7] text-[#434655] hover:border-[#004ac6] hover:bg-[#f5f7fb]'
              }
              hover:scale-[1.02] active:scale-95
              flex items-center gap-1.5
            `}
          >
            {moreFiltersLabel}
            <Icon
              name="chevronDown"
              size={14}
              className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isMoreOpen && (
            <div className="absolute right-0 mt-1.5 min-w-[200px] bg-white rounded-xl border border-[#e0e3e5] shadow-lg z-50 p-2 animate-slideDown">
              {hiddenFilters.map((filter) => {
                const isActive = filter.value !== filter.options[0]?.value;

                return (
                  <div key={filter.key} className="relative mb-1 last:mb-0">
                    {filter.label && (
                      <label className="block text-[10px] font-semibold uppercase text-[#737686] px-2 pt-1.5 pb-0.5">
                        {filter.label}
                      </label>
                    )}
                    <select
                      value={filter.value}
                      onChange={(e) => handleFilterChange(filter, e.target.value)}
                      className={`
                        appearance-none w-full px-3 py-2 pr-8 rounded-lg text-sm font-medium
                        border transition-all duration-200 ease-out
                        bg-white cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-[#004ac6]/30
                        ${isActive
                          ? 'border-[#004ac6] text-[#004ac6] bg-[#f5f7fb]'
                          : 'border-[#c3c6d7] text-[#434655] hover:border-[#004ac6] hover:bg-[#f5f7fb]'
                        }
                      `}
                    >
                      {filter.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isActive ? 'text-[#004ac6]' : 'text-[#737686]'}`}>
                      <Icon name="chevronDown" size={12} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {hiddenFilters.length === 0 && onMoreFilters && (
        <button
          onClick={handleMoreClick}
          className="px-4 py-2.5 rounded-xl text-sm font-medium border border-[#c3c6d7] text-[#434655] hover:border-[#004ac6] hover:text-[#004ac6] hover:bg-[#f5f7fb] transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          {moreFiltersLabel}
        </button>
      )}
    </div>
  );
};

export default FilterBar;