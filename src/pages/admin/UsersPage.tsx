import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Pagination from '../../components/ui/Pagination';
import { getUsers, type AdminUser } from '../../api/admin';
import { formatRupiah } from '../../utils/currency';

const PAGE_SIZE = 10;

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-[#e6f4ee] text-[#12805c]',
  SUSPENDED: 'bg-[#fff0f0] text-[#93000a]',
};

const statusLabel: Record<string, string> = {
  ACTIVE: 'Aktif',
  SUSPENDED: 'Dibekukan',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      getUsers({ role: activeTab, q: search.trim() || undefined, page, limit: PAGE_SIZE })
        .then((res) => {
          if (!alive) return;
          setItems(res.data.data);
          setTotal(res.data.meta.total);
          setTotalPages(res.data.meta.totalPages);
        })
        .catch((err: Error) => {
          if (alive) setError(err.message);
        })
        .finally(() => {
          if (alive) setIsLoading(false);
        });
    }, 300);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [activeTab, search, page]);

  const switchTab = (tab: 'BUYER' | 'SELLER') => {
    setActiveTab(tab);
    setPage(1);
  };

  const colSpan = activeTab === 'BUYER' ? 6 : 8;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#101319]">Pengguna</h1>
          <p className="text-[15px] text-[#737686]">
            {activeTab === 'BUYER'
              ? 'Kelola dan pantau seluruh pembeli terdaftar.'
              : 'Kelola dan verifikasi penjual beserta tokonya.'}
          </p>
        </div>

        <div className="flex gap-2 border-b border-[#e0e3e5]">
          {(['BUYER', 'SELLER'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'border-[#004ac6] text-[#004ac6]'
                  : 'border-transparent text-[#737686] hover:text-[#101319]'
              }`}
            >
              {tab === 'BUYER' ? 'Pembeli' : 'Penjual'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama, username, atau email…"
            className="w-full max-w-sm rounded-full border border-[#c3c6d7] bg-white px-4 py-2 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
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
                  {activeTab === 'BUYER' ? (
                    <>
                      <th className="pb-2 text-center">Nama</th>
                      <th className="pb-2 text-center">Email</th>
                      <th className="pb-2 text-center">Order</th>
                      <th className="pb-2 text-center">Total Belanja</th>
                      <th className="pb-2 text-center">Status</th>
                      <th className="pb-2 text-center">Bergabung</th>
                    </>
                  ) : (
                    <>
                      <th className="pb-2 text-center">Penjual</th>
                      <th className="pb-2 text-center">Toko</th>
                      <th className="pb-2 text-center">Produk</th>
                      <th className="pb-2 text-center">Order</th>
                      <th className="pb-2 text-center">Omzet</th>
                      <th className="pb-2 text-center">Rating</th>
                      <th className="pb-2 text-center">Status</th>
                      <th className="pb-2 text-center">Bergabung</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {isLoading ? (
                  <tr>
                    <td colSpan={colSpan} className="py-10 text-center text-[#737686]">
                      Memuat…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={colSpan} className="py-10 text-center text-[#737686]">
                      {activeTab === 'BUYER' ? 'Pembeli' : 'Penjual'} nggak ketemu.
                    </td>
                  </tr>
                ) : (
                  items.map((user) => (
                    <tr key={user.id} className="text-[13px]">
                      {activeTab === 'BUYER' ? (
                        <>
                          <td className="py-2.5 text-center font-medium text-[#101319]">{user.name}</td>
                          <td className="py-2.5 text-center text-[#737686]">{user.email}</td>
                          <td className="py-2.5 text-center">{user.totalOrders}</td>
                          <td className="py-2.5 text-center font-semibold">{formatRupiah(user.totalSpent)}</td>
                          <td className="py-2.5 text-center">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor.ACTIVE}`}>
                              {statusLabel.ACTIVE}
                            </span>
                          </td>
                          <td className="py-2.5 text-center text-[#737686]">{formatDate(user.createdAt)}</td>
                        </>
                      ) : (
                        <>
                          <td className="py-2.5 text-center font-medium text-[#101319]">{user.name}</td>
                          <td className="py-2.5 text-center font-medium text-[#004ac6]">
                            {user.seller?.storeName ?? 'Belum ada toko'}
                          </td>
                          <td className="py-2.5 text-center">{user.seller?.products ?? 0}</td>
                          <td className="py-2.5 text-center">{user.seller?.orders ?? 0}</td>
                          <td className="py-2.5 text-center font-semibold">
                            {formatRupiah(user.seller?.revenue ?? 0)}
                          </td>
                          <td className="py-2.5 text-center">{(user.seller?.rating ?? 0).toFixed(1)}</td>
                          <td className="py-2.5 text-center">
                            {user.seller ? (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                  statusColor[user.seller.status]
                                }`}
                              >
                                {statusLabel[user.seller.status]}
                              </span>
                            ) : (
                              <span className="text-[#737686]">Belum punya toko</span>
                            )}
                          </td>
                          <td className="py-2.5 text-center text-[#737686]">{formatDate(user.createdAt)}</td>
                        </>
                      )}
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

export default UsersPage;
