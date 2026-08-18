import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import { formatRupiah } from '../../utils/currency';
import { getProducts, setProductActive, type AdminProduct } from '../../api/admin';
import { getAdminCategories, type AdminCategory } from '../../api/categories';

type Tab = 'all' | 'inactive';

const PAGE_SIZE = 10;

const ProductsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('all');
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState('');
  const [search, setSearch] = useState('');

  const [items, setItems] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getProducts({
      isActive: tab === 'inactive' ? false : undefined,
      categoryId: categoryId || undefined,
      q: search.trim() || undefined,
      page,
      limit: PAGE_SIZE,
    })
      .then((res) => {
        setItems(res.data.data);
        setTotal(res.data.meta.total);
        setTotalPages(res.data.meta.totalPages);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [tab, categoryId, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  useEffect(() => {
    getAdminCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [tab, categoryId, search]);

  const toggleActive = async (product: AdminProduct) => {
    setPendingId(product.id);
    try {
      await setProductActive(product.id, !product.isActive);
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPendingId(null);
    }
  };

  const categoryOptions = [
    { label: 'Semua Kategori', value: '' },
    ...categories.map((cat) => ({ label: cat.name, value: cat.id })),
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Produk</h1>
          <p className="text-[15px] text-[#737686]">
            Pantau dan moderasi semua produk yang ada di marketplace.
          </p>
        </div>

        <div className="flex gap-2 border-b border-[#e0e3e5]">
          {([
            ['all', 'Semua Produk'],
            ['inactive', 'Belum Aktif'],
          ] as [Tab, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                tab === value
                  ? 'border-[#004ac6] text-[#004ac6]'
                  : 'border-transparent text-[#737686] hover:text-[#191c1e]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama produk atau SKU…"
              className="w-64 rounded-xl border border-[#c3c6d7] px-4 py-2.5 pl-9 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
            />
            <Icon
              name="search"
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]"
            />
          </div>

          <FilterBar
            filters={[
              {
                key: 'category',
                options: categoryOptions,
                value: categoryId,
                onChange: setCategoryId,
              },
            ]}
            visibleFilters={1}
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-[#ffcdd2] bg-[#fff5f5] p-4 text-[13px] text-[#a33131]">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2 text-left">Produk</th>
                  <th className="pb-2 pr-2 text-left">Toko</th>
                  <th className="pb-2 pr-2 text-left">Kategori</th>
                  <th className="pb-2 pr-2 text-left">Harga</th>
                  <th className="pb-2 pr-2 text-center">Stok</th>
                  <th className="pb-2 pr-2 text-center">Status</th>
                  <th className="pb-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[#737686]">
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#004ac6] border-t-transparent" />
                      <span className="ml-2">Memuat…</span>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[#737686]">
                      {search
                        ? `Nggak ada produk yang cocok sama "${search}".`
                        : tab === 'inactive'
                        ? 'Nggak ada produk yang nunggu diaktifkan.'
                        : 'Belum ada produk.'}
                    </td>
                  </tr>
                ) : (
                  items.map((product) => (
                    <tr key={product.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
                      <td className="py-2.5 pr-2 font-medium text-[#191c1e]">
                        <div>{product.name}</div>
                        {product.sku && (
                          <div className="text-[11px] font-normal text-[#737686]">{product.sku}</div>
                        )}
                      </td>
                      <td className="py-2.5 pr-2 text-[#434655]">{product.seller.storeName}</td>
                      <td className="py-2.5 pr-2 text-[#434655]">{product.category.name}</td>
                      <td className="py-2.5 pr-2 font-semibold text-[#004ac6]">
                        {formatRupiah(Number(product.price))}
                      </td>
                      <td className="py-2.5 pr-2 text-center">{product.stock}</td>
                      <td className="py-2.5 pr-2 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            product.isActive
                              ? 'bg-[#d7f5dc] text-[#156b32]'
                              : 'bg-[#fff4e0] text-[#b45309]'
                          }`}
                        >
                          {product.isActive ? 'Aktif' : 'Belum Aktif'}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          onClick={() => void toggleActive(product)}
                          disabled={pendingId === product.id}
                          className={`rounded-full px-3 py-1 text-[12px] font-semibold text-white transition-colors disabled:opacity-50 ${
                            product.isActive
                              ? 'bg-[#ba1a1a] hover:bg-[#9a1515]'
                              : 'bg-[#004ac6] hover:bg-[#003ea8]'
                          }`}
                        >
                          {product.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
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
                totalItems={total}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                showTotal
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
