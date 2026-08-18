import React, { useCallback, useEffect, useState } from 'react';

import SellerLayout from './SellerLayout';
import Reveal from '../../components/ui/Reveal';

import ProductsHeader from '../../components/seller_products/ProductsHeader';
import ProductsStatsCards from '../../components/seller_products/ProductsStatsCards';
import ProductsToolbar from '../../components/seller_products/ProductsToolbar';
import ProductsTable from '../../components/seller_products/ProductsTable';
import ProductsMobileList from '../../components/seller_products/ProducstMobileList';
import ProductsEmptyState from '../../components/seller_products/ProductsEmptyState';
import Pagination from '../../components/ui/Pagination';

import ProductForm from '../../components/ui/ProductForm';
import DeleteDialog from '../../components/ui/DeleteDialog';

import { getCategories } from '../../api/categories';
import {
  getInventStats,
  listInvent,
  productStatus,
  type InventMeta,
  type InventProduct,
  type InventStats,
} from '../../api/invent';
import type { Category } from '../../types';

const PAGE_SIZE = 10;

type SortableField = 'name' | 'price' | 'stock' | 'createdAt';
interface SortConfig {
  field: SortableField;
  order: 'asc' | 'desc';
}

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortConfig>({
    field: 'createdAt',
    order: 'desc',
  });

  const [products, setProducts] = useState<InventProduct[]>([]);
  const [meta, setMeta] = useState<InventMeta | null>(null);
  const [stats, setStats] = useState<InventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventProduct | null>(null);
  const [deleting, setDeleting] = useState<InventProduct | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (field: SortableField) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
    setPage(1);
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

  const clearSearch = () => setSearch('');

  return (
    <SellerLayout>
      <div className="space-y-5 sm:space-y-6">
        
        <Reveal direction="up">
          <ProductsHeader onAddNew={openCreate} />
        </Reveal>

        <Reveal direction="up" delay={60}>
          <ProductsStatsCards stats={stats} loading={loading} />
        </Reveal>

        <Reveal direction="up" delay={120}>
          <ProductsToolbar
            search={search}
            onSearchChange={setSearch}
            onAddNew={openCreate}
            totalProducts={meta?.total ?? 0}
            loading={loading}
          />
        </Reveal>

        <Reveal direction="up">
          {loading ? (
            <div
              className="
                overflow-hidden rounded-[24px] border border-white/80
                bg-white/95 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
                backdrop-blur-sm
              "
            >
              <div className="space-y-0 divide-y divide-[#F5F7FB]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-[#F5F7FB]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-[#F5F7FB]" />
                      <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#F5F7FB]" />
                    </div>
                    <div className="h-8 w-20 animate-pulse rounded-full bg-[#F5F7FB]" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <ProductsEmptyState
              variant="error"
              errorMessage={error}
              onRetry={load}
            />
          ) : products.length === 0 ? (
            <ProductsEmptyState
              variant={debouncedSearch ? 'no-match' : 'empty'}
              query={debouncedSearch}
              onAddNew={openCreate}
              onClearSearch={clearSearch}
            />
          ) : (
            <div
              className="
                overflow-hidden rounded-[24px] border border-white/80
                bg-white/95 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
                backdrop-blur-sm
              "
            >
              
              <div className="hidden lg:block">
                <ProductsTable
                  products={products}
                  sort={sort}
                  onSort={handleSort}
                  getStatus={productStatus}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                />
              </div>

              <div className="p-3 lg:hidden sm:p-4">
                <ProductsMobileList
                  products={products}
                  getStatus={productStatus}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                />
              </div>

              {meta && (
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  totalItems={meta.total}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                  className="px-4 py-3 sm:px-5"
                />
              )}
            </div>
          )}
        </Reveal>
      </div>

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