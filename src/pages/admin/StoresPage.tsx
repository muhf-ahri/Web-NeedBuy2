import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import { getStores, setStoreStatus, type AdminStore, type SellerStatus } from '../../api/admin';
import { formatRupiah } from '../../utils/currency';

const PAGE_SIZE = 10;

const statusColor: Record<SellerStatus, string> = {
  ACTIVE: 'bg-[#e6f4ee] text-[#12805c]',
  SUSPENDED: 'bg-[#fff0f0] text-[#93000a]',
};

const statusLabel: Record<SellerStatus, string> = {
  ACTIVE: 'Aktif',
  SUSPENDED: 'Dibekukan',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const StoresPage: React.FC = () => {
  const [status, setStatus] = useState<SellerStatus | ''>('');
  const [minRating, setMinRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<AdminStore[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getStores({
      status: status || undefined,
      minRating: minRating ? Number(minRating) : undefined,
      q: searchTerm.trim() || undefined,
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
  }, [status, minRating, searchTerm, page]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), searchTerm ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [status, minRating, searchTerm]);

  const toggleStatus = async (store: AdminStore) => {
    const next: SellerStatus = store.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setPendingId(store.id);
    try {
      await setStoreStatus(store.id, next);
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPendingId(null);
    }
  };

  const statusOptions = [
    { label: 'Semua Status', value: '' },
    { label: 'Aktif', value: 'ACTIVE' },
    { label: 'Dibekukan', value: 'SUSPENDED' },
  ];

  const ratingOptions = [
    { label: 'Semua Rating', value: '' },
    { label: '★ 4.5 ke atas', value: '4.5' },
    { label: '★ 4.0 ke atas', value: '4' },
    { label: '★ 3.0 ke atas', value: '3' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#101319]">Toko</h1>
          <p className="text-[15px] text-[#737686]">Kelola dan pantau toko, rating, serta performanya.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama toko atau pemilik…"
              className="w-64 rounded-xl border border-[#c3c6d7] px-4 py-2.5 pl-9 text-sm outline-none transition focus:border-[#538cbd] focus:ring-2 focus:ring-[#538cbd]/20"
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
                key: 'status',
                options: statusOptions,
                value: status,
                onChange: (val) => setStatus(val as SellerStatus | ''),
              },
              {
                key: 'rating',
                options: ratingOptions,
                value: minRating,
                onChange: setMinRating,
              },
            ]}
            moreFiltersLabel="Filter Lainnya"
            visibleFilters={2}
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff0f0] p-4 text-[13px] text-[#93000a]">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <div className="overflow-x-auto">
            <table className="stack-table w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2 text-left">Toko</th>
                  <th className="pb-2 pr-2 text-left">Pemilik</th>
                  <th className="pb-2 pr-2 text-left">Produk</th>
                  <th className="pb-2 pr-2 text-left">Order</th>
                  <th className="pb-2 pr-2 text-left">Omzet Kotor</th>
                  <th className="pb-2 pr-2 text-left">Komisi</th>
                  <th className="pb-2 pr-2 text-left">Diterima Penjual</th>
                  <th className="pb-2 pr-2 text-left">Rating</th>
                  <th className="pb-2 pr-2 text-left">Status</th>
                  <th className="pb-2 pr-2 text-left">Dibuat</th>
                  <th className="pb-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {isLoading ? (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-[#737686]">
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#538cbd] border-t-transparent" />
                      <span className="ml-2">Memuat…</span>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-[#737686]">
                      {searchTerm ? `Tidak ada toko yang cocok dengan "${searchTerm}"` : 'Belum ada toko.'}
                    </td>
                  </tr>
                ) : (
                  items.map((store) => (
                    <tr key={store.id} className="text-[13px] transition-colors hover:bg-[#f5f7fb]">
                      <td className="py-2.5 pr-2 text-left font-medium text-[#101319]">
                        {store.storeName}
                        {store.vacationMode && (
                          <span className="ml-1 rounded-full bg-[#f2f4f6] px-2 py-0.5 text-[10px] text-[#737686]">
                            libur
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-2 text-left text-[#737686]">{store.owner}</td>
                      <td className="py-2.5 pr-2 text-left">{store.products.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 pr-2 text-left">{store.orders.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 pr-2 text-left">{formatRupiah(store.revenue)}</td>
                      <td className="py-2.5 pr-2 text-left font-semibold text-[#4077a6]">
                        {formatRupiah(store.commission)}
                      </td>
                      <td className="py-2.5 pr-2 text-left font-semibold">
                        {formatRupiah(store.netRevenue)}
                      </td>
                      <td className="py-2.5 pr-2 text-left">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="star" size={14} className="text-[#ffd500]" />
                          {store.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2 text-left">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[store.status]}`}>
                          {statusLabel[store.status]}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2 text-left text-[#737686]">{formatDate(store.createdAt)}</td>
                      <td className="py-2.5 text-left">
                        <button
                          onClick={() => void toggleStatus(store)}
                          disabled={pendingId === store.id}
                          className={`rounded-full px-3 py-1 text-[12px] font-semibold text-white transition-colors disabled:opacity-50 ${
                            store.status === 'ACTIVE'
                              ? 'bg-[#ba1a1a] hover:bg-[#93000a]'
                              : 'bg-[#4077a6] hover:bg-[#284a67]'
                          }`}
                        >
                          {store.status === 'ACTIVE' ? 'Bekukan' : 'Aktifkan'}
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

export default StoresPage;