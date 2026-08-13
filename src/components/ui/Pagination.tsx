// src/components/ui/Pagination.tsx
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
  const endItem = totalItems ? Math.min(currentPage * (pageSize || 1), totalItems) : 0;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      {/* Info total */}
      {showTotal && totalItems !== undefined && (
        <div className="text-[12px] text-[#737686]">
          Menampilkan <span className="font-semibold text-[#191c1e]">{startItem}</span> sampai{' '}
          <span className="font-semibold text-[#191c1e]">{endItem}</span> dari{' '}
          <span className="font-semibold text-[#191c1e]">{totalItems}</span> produk
        </div>
      )}

      {/* Tombol navigasi */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#c3c6d7] text-[#737686] hover:border-[#004ac6] hover:text-[#004ac6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#c3c6d7] disabled:hover:text-[#737686]"
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
                className="flex items-center justify-center w-9 h-9 text-[13px] text-[#737686]"
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
              className={`flex items-center justify-center w-9 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#004ac6] text-white'
                  : 'text-[#434655] hover:bg-[#f2f4f6] hover:text-[#004ac6]'
              }`}
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
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#c3c6d7] text-[#737686] hover:border-[#004ac6] hover:text-[#004ac6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#c3c6d7] disabled:hover:text-[#737686]"
          aria-label="Halaman berikutnya"
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;