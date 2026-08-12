// src/pages/seller/ProductsPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import ProductForm from '../../components/ui/ProductForm';
import DeleteDialog from '../../components/ui/DeleteDialog';
import { formatRupiah } from '../../utils/currency';
import { getCategories } from '../../api/categories';
import {
  getInventStats,
  listInvent,
  productStatus,
  type InventMeta,
  type InventProduct,
  type InventStats,
  type ProductStatus,
} from '../../api/invent';
import type { Category } from '../../types';

const PAGE_SIZE = 10;

const STATUS_CLASS: Record<ProductStatus, string> = {
  Tayang: 'bg-[#d7f5dc] text-[#156b32]',
  'Stok Habis': 'bg-[#ffe0e0] text-[#a33131]',
  Draf: 'bg-[#f2f4f6] text-[#737686]',
};

type SortableField = 'name' | 'price' | 'stock' | 'createdAt';

interface SortConfig {
  field: SortableField;
  order: 'asc' | 'desc';
}

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortConfig>({ field: 'createdAt', order: 'desc' });

  const [products, setProducts] = useState<InventProduct[]>([]);
  const [meta, setMeta] = useState<InventMeta | null>(null);
  const [stats, setStats] = useState<InventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventProduct | null>(null);
  const [deleting, setDeleting] = useState<InventProduct | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle sort toggle
  const handleSort = (field: SortableField) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
    setPage(1);
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortableField) => {
    const isActive = sort.field === field;
    const isAsc = sort.order === 'asc';

    if (!isActive) {
      return (
        <div className="flex flex-col items-center opacity-30 group-hover:opacity-70 transition-opacity">
          <Icon name="chevronUp" size={10} className="text-[#737686] -mb-0.5" />
          <Icon name="chevronDown" size={10} className="text-[#737686] -mt-0.5" />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <Icon
          name="chevronUp"
          size={10}
          className={`${isAsc ? 'text-[#004ac6]' : 'text-[#c3c6d7]'} -mb-0.5 transition-colors`}
        />
        <Icon
          name="chevronDown"
          size={10}
          className={`${!isAsc ? 'text-[#004ac6]' : 'text-[#c3c6d7]'} -mt-0.5 transition-colors`}
        />
      </div>
    );
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, statsRes] = await Promise.all([
        listInvent({
          q: debouncedSearch || undefined,
          page,
          limit: PAGE_SIZE,
          status: 'ALL',
          sortBy: sort.field,
          order: sort.order,
        }),
        getInventStats(),
      ]);
      setProducts(list.items);
      setMeta(list.meta);
      setStats(statsRes.data.data);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal muat produk, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, sort]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: InventProduct) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    load();
  };

  const handleDeleted = () => {
    setDeleting(null);
    if (products.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      load();
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Produk Saya</h1>
          <p className="text-[15px] text-[#737686]">Atur stok dan produk yang kamu jual di sini</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-4 text-center">
            <p className="text-[11px] font-semibold text-[#737686] uppercase">Produk Tayang</p>
            <p className="text-[24px] font-bold text-[#191c1e]">{stats?.active ?? '—'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-4 text-center">
            <p className="text-[11px] font-semibold text-[#737686] uppercase">Stok Habis</p>
            <p className="text-[24px] font-bold text-[#ba1a1a]">{stats?.outOfStock ?? '—'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-4 text-center">
            <p className="text-[11px] font-semibold text-[#737686] uppercase">Draf</p>
            <p className="text-[24px] font-bold text-[#737686]">{stats?.drafts ?? '—'}</p>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk kamu..."
              className="w-full pl-9 pr-3 py-2 rounded-full border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition"
            />
          </div>
          <Button variant="primary" className="px-5 py-2 text-sm" onClick={openCreate}>
            <Icon name="plus" size={16} className="mr-1" />
            Add New Product
          </Button>
        </div>

        {/* Product table */}
        <div className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2f4f6] text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
                  <th className="px-4 py-3 text-center">Gambar</th>

                  <th
                    className="px-4 py-3 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Nama Produk</span>
                      {renderSortIndicator('name')}
                    </div>
                  </th>

                  <th className="px-4 py-3 text-center">Kategori</th>

                  <th
                    className="px-4 py-3 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Harga</span>
                      {renderSortIndicator('price')}
                    </div>
                  </th>

                  <th
                    className="px-4 py-3 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Sisa Stok</span>
                      {renderSortIndicator('stock')}
                    </div>
                  </th>

                  <th className="px-4 py-3 text-center">Status</th>

                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e3e5]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#737686]">
                      Memuat produk…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#ba1a1a]">
                      {error}
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#737686]">
                      {debouncedSearch
                        ? `Tidak ada produk yang cocok dengan "${debouncedSearch}".`
                        : 'Belum ada produk. Klik "Add New Product" untuk menambah.'}
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const status = productStatus(product);
                    const image = product.images[0]?.url;
                    return (
                      <tr key={product.id} className="hover:bg-[#f8f9fb] transition-colors">
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <div className="w-10 h-10 bg-[#f2f4f6] rounded-lg overflow-hidden flex items-center justify-center text-[#737686]">
                              {image ? (
                                <img src={image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Icon name="product" size={20} />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-[#191c1e]">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-center text-[#434655]">
                          {product.category?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-[#004ac6]">
                          {formatRupiah(Number(product.price))}
                        </td>
                        <td className="px-4 py-3 text-center">{product.stock}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_CLASS[status]}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            {/* Edit */}
                            <button
                              onClick={() => openEdit(product)}
                              className="p-1.5 rounded-lg text-[#737686] hover:text-[#004ac6] hover:bg-[#f2f4f6] transition-colors"
                              aria-label={`Edit ${product.name}`}
                            >
                              <Icon name="edit" size={16} />
                            </button>

                            {/* Divider */}
                            <span className="w-px h-5 bg-[#e0e3e5]" />

                            {/* View */}
                            <Link
                              to={`/products/${product.slug}`}
                              className="p-1.5 rounded-lg text-[#737686] hover:text-[#004ac6] hover:bg-[#f2f4f6] transition-colors"
                              aria-label={`Lihat ${product.name} di toko`}
                            >
                              <Icon name="eye" size={16} />
                            </Link>

                            {/* Divider */}
                            <span className="w-px h-5 bg-[#e0e3e5]" />

                            {/* Delete */}
                            <button
                              onClick={() => setDeleting(product)}
                              className="p-1.5 rounded-lg text-[#737686] hover:text-[#ba1a1a] hover:bg-[#ffe0e0] transition-colors"
                              aria-label={`Hapus ${product.name}`}
                            >
                              <Icon name="trash" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#e0e3e5]">
              <span className="text-[12px] text-[#737686]">
                Halaman {meta.page} dari {meta.totalPages} · {meta.total} produk
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.page <= 1}
                  className="px-3 py-1 rounded-full border border-[#c3c6d7] text-[12px] disabled:opacity-40 hover:border-[#004ac6] transition"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="px-3 py-1 rounded-full border border-[#c3c6d7] text-[12px] disabled:opacity-40 hover:border-[#004ac6] transition"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Produk */}
      {formOpen && (
        <ProductForm
          editing={editing}
          categories={categories}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {/* Dialog Hapus */}
      {deleting && (
        <DeleteDialog
          product={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={handleDeleted}
        />
      )}
    </SellerLayout>
  );
};

export default ProductsPage;