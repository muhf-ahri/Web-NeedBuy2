// src/pages/admin/components/TableCategoryChild.tsx
import React from 'react';
import Icon from '../../../components/ui/Icon';
import Pagination from '../../../components/ui/Pagination';
import { type Category } from '../data/categoryData';

interface TableCategoryChildProps {
  data: Category[];
  parentMap: Record<string, string>; // id -> name
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  statusColor: Record<string, string>;
  formatDate: (iso: string) => string;
}

const TableCategoryChild: React.FC<TableCategoryChildProps> = ({
  data,
  parentMap,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  isLoading = false,
  statusColor,
  formatDate,
}) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white p-5">
        <div className="py-10 text-center text-[#737686]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#004ac6] border-t-transparent" />
          <span className="ml-2">Memuat…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white p-5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
              <th className="pb-2 pr-2 text-left">Nama Subkategori</th>
              <th className="pb-2 pr-2 text-left">Induk</th>
              <th className="pb-2 pr-2 text-left">Deskripsi</th>
              <th className="pb-2 pr-2 text-left">Total Produk</th>
              <th className="pb-2 pr-2 text-left">Status</th>
              <th className="pb-2 pr-2 text-left">Dibuat</th>
              <th className="pb-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f6]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#737686]">
                  Belum ada subkategori. Klik "Tambah Subkategori" untuk memulai.
                </td>
              </tr>
            ) : (
              data.map((category) => (
                <tr key={category.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
                  <td className="py-2.5 pr-2 font-medium text-[#191c1e]">{category.name}</td>
                  <td className="py-2.5 pr-2 text-[#004ac6]">
                    {parentMap[category.parentId || ''] || '—'}
                  </td>
                  <td className="py-2.5 pr-2 text-[#737686]">
                    {category.description || '—'}
                  </td>
                  <td className="py-2.5 pr-2 text-[#434655]">
                    {category._count.products.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 pr-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        statusColor[category.isActive ? 'active' : 'inactive']
                      }`}
                    >
                      {category.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-2.5 pr-2 text-[#737686]">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(category)}
                        className="rounded-lg p-1.5 text-[#737686] transition-colors hover:bg-[#f2f4f6] hover:text-[#004ac6]"
                        aria-label="Edit subkategori"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(category.id)}
                        className="rounded-lg p-1.5 text-[#737686] transition-colors hover:bg-[#ffe0e0] hover:text-[#ba1a1a]"
                        aria-label="Hapus subkategori"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 border-t border-[#e0e3e5] pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
            showTotal
          />
        </div>
      )}
    </div>
  );
};

export default TableCategoryChild;