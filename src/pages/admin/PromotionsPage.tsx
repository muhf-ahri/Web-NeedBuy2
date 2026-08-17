import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import VoucherTable from './components/TableVoucher';
import { getCoupons, updateCoupon, type AdminCoupon } from '../../api/admin';

const PAGE_SIZE = 10;

const PromotionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const [items, setItems] = useState<AdminCoupon[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getCoupons({
      isActive: statusFilter === '' ? undefined : statusFilter === 'active',
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
  }, [statusFilter, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleActive = async (coupon: AdminCoupon) => {
    setPendingId(coupon.id);
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive });
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPendingId(null);
    }
  };

  const statusOptions = [
    { label: 'Semua Status', value: '' },
    { label: 'Aktif', value: 'active' },
    { label: 'Ditahan', value: 'paused' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Promosi</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola kupon diskon yang bisa dipakai pembeli saat checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterBar
            filters={[
              {
                key: 'status',
                options: statusOptions,
                value: statusFilter,
                onChange: (val) => {
                  setStatusFilter(val);
                  setPage(1);
                },
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
                  <th className="pb-2 pr-2 text-left">Kode / Judul</th>
                  <th className="pb-2 pr-2 text-left">Tipe</th>
                  <th className="pb-2 pr-2 text-left">Nilai</th>
                  <th className="pb-2 pr-2 text-left">Penggunaan</th>
                  <th className="pb-2 pr-2 text-left">Berlaku</th>
                  <th className="pb-2 pr-2 text-left">Status</th>
                  <th className="pb-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                <VoucherTable
                  vouchers={items}
                  isLoading={isLoading}
                  emptyMessage={
                    statusFilter
                      ? 'Nggak ada kupon yang cocok sama filter ini.'
                      : 'Belum ada kupon.'
                  }
                  onToggleActive={(coupon) => void toggleActive(coupon)}
                  pendingId={pendingId}
                />
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

export default PromotionsPage;
