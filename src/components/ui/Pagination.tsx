import React from 'react';

import Icon from './Icon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
  showTotal?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
  showTotal = true,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const total = totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(total - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < total - 2) pages.push('ellipsis');
    pages.push(total);

    return pages;
  };

  const visiblePages = getVisiblePages();

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startItem = totalItems ? (currentPage - 1) * (pageSize || 1) + 1 : 0;
  const endItem = totalItems
    ? Math.min(currentPage * (pageSize || 1), totalItems)
    : 0;

  return (
    <div
      className={`
        flex flex-col items-center justify-between gap-3
        sm:flex-row sm:gap-4 ${className}
      `}
    >
      {showTotal && totalItems !== undefined && (
        <div className="hidden items-center gap-2.5 sm:flex">
          <span
            className="
              flex h-7 w-7 items-center justify-center rounded-lg
              bg-[#004ac6]/10
            "
          >
            <Icon name="product" size={14} className="text-[#004ac6]" />
          </span>
          <p className="text-[12px] text-[#737686]">
            Menampilkan{' '}
            <span className="font-bold text-[#101319]">{startItem}</span>
            {' '}sampai{' '}
            <span className="font-bold text-[#101319]">{endItem}</span>
            {' '}dari{' '}
            <span className="font-bold text-[#101319]">{totalItems}</span>
            {' '}produk
          </p>
        </div>
      )}

      {showTotal && totalItems !== undefined && (
        <p className="text-[11px] text-[#737686] sm:hidden">
          <span className="font-bold text-[#101319] tabular-nums">
            {startItem} sampai {endItem}
          </span>{' '}
          dari{' '}
          <span className="font-bold text-[#101319] tabular-nums">
            {totalItems}
          </span>{' '}
          produk
        </p>
      )}

      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="
            flex h-8 w-8 items-center justify-center rounded-full
            border border-[#e0e3e5] bg-white text-[#737686]
            transition-all duration-200 hover:border-[#004ac6]
            hover:text-[#004ac6] hover:shadow-[0_4px_12px_rgba(83,140,219,0.15)]
            active:scale-[0.95] disabled:cursor-not-allowed
            disabled:border-[#e0e3e5] disabled:bg-[#F5F7FB]
            disabled:text-[#e0e3e5] disabled:shadow-none sm:h-9 sm:w-9
          "
          aria-label="Halaman sebelumnya"
        >
          <Icon name="chevronLeft" size={15} />
        </button>

        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="
                  flex h-8 w-8 items-center justify-center text-[13px]
                  font-bold text-[#A2A8B3] sm:h-9 sm:w-9 sm:text-[14px]
                "
              >
                …
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={`
                flex h-8 min-w-[32px] items-center justify-center
                rounded-full px-1.5 text-[12px] font-bold transition-all
                duration-200 active:scale-[0.95] sm:h-9 sm:min-w-[36px]
                sm:px-2 sm:text-[13px]
                ${
                  isActive
                    ? 'bg-[#004ac6] text-white shadow-[0_6px_16px_rgba(83,140,219,0.30)]'
                    : 'border border-transparent text-[#737686] hover:border-[#e0e3e5] hover:bg-white hover:text-[#004ac6] hover:shadow-[0_3px_10px_rgba(83,140,219,0.10)]'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="
            flex h-8 w-8 items-center justify-center rounded-full
            border border-[#e0e3e5] bg-white text-[#737686]
            transition-all duration-200 hover:border-[#004ac6]
            hover:text-[#004ac6] hover:shadow-[0_4px_12px_rgba(83,140,219,0.15)]
            active:scale-[0.95] disabled:cursor-not-allowed
            disabled:border-[#e0e3e5] disabled:bg-[#F5F7FB]
            disabled:text-[#e0e3e5] disabled:shadow-none sm:h-9 sm:w-9
          "
          aria-label="Halaman berikutnya"
        >
          <Icon name="chevronRight" size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;