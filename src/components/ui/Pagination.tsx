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

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(total - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < total - 2) {
      pages.push('ellipsis');
    }

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
        flex flex-col items-center justify-between gap-4 sm:flex-row
        sm:gap-6 ${className}
      `}
    >
      {/* Info total — pill style dengan icon */}
      {showTotal && totalItems !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className="
              flex h-7 w-7 items-center justify-center rounded-lg
              bg-[#538CDB]/10
            "
          >
            <Icon name="product" size={14} className="text-[#538CDB]" />
          </span>
          <p className="text-[12px] text-[#737A87]">
            Menampilkan{' '}
            <span className="font-bold text-[#20242D]">{startItem}</span>
            –
            <span className="font-bold text-[#20242D]">{endItem}</span>
            {' '}dari{' '}
            <span className="font-bold text-[#20242D]">{totalItems}</span>
            {' '}produk
          </p>
        </div>
      )}

      {/* Tombol navigasi */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="
            flex h-9 w-9 items-center justify-center rounded-full
            border border-[#E8ECF4] bg-white text-[#737A87]
            transition-all duration-200 hover:border-[#538CDB]
            hover:text-[#538CDB] hover:shadow-[0_4px_12px_rgba(83,140,219,0.15)]
            active:scale-[0.95] disabled:cursor-not-allowed
            disabled:border-[#E8ECF4] disabled:bg-[#F5F7FB]
            disabled:text-[#D8DEE9] disabled:shadow-none
            disabled:hover:border-[#E8ECF4] disabled:hover:text-[#D8DEE9]
          "
          aria-label="Halaman sebelumnya"
        >
          <Icon name="chevronLeft" size={16} />
        </button>

        {/* Page numbers */}
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="
                  flex h-9 w-9 items-center justify-center text-[14px]
                  font-bold text-[#A2A8B3]
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
              onClick={() => goToPage(page)}
              className={`
                flex h-9 min-w-[36px] items-center justify-center
                rounded-full px-2 text-[13px] font-bold transition-all
                duration-200 active:scale-[0.95]
                ${
                  isActive
                    ? 'bg-[#538CDB] text-white shadow-[0_6px_16px_rgba(83,140,219,0.30)]'
                    : 'border border-transparent text-[#737A87] hover:border-[#E8ECF4] hover:bg-white hover:text-[#538CDB] hover:shadow-[0_3px_10px_rgba(83,140,219,0.10)]'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="
            flex h-9 w-9 items-center justify-center rounded-full
            border border-[#E8ECF4] bg-white text-[#737A87]
            transition-all duration-200 hover:border-[#538CDB]
            hover:text-[#538CDB] hover:shadow-[0_4px_12px_rgba(83,140,219,0.15)]
            active:scale-[0.95] disabled:cursor-not-allowed
            disabled:border-[#E8ECF4] disabled:bg-[#F5F7FB]
            disabled:text-[#D8DEE9] disabled:shadow-none
            disabled:hover:border-[#E8ECF4] disabled:hover:text-[#D8DEE9]
          "
          aria-label="Halaman berikutnya"
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;