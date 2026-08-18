import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import PaymentTable from './components/TablePayments';
import {
  getPayments,
  type AdminPayment,
  type PaymentMethod,
  type PaymentStatus,
} from '../../api/admin';

const PAGE_SIZE = 10;

const PaymentsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const [method, setMethod] = useState<PaymentMethod | ''>('');

  const [items, setItems] = useState<AdminPayment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getPayments({
      status: status || undefined,
      method: method || undefined,
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
  }, [status, method, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const statusOptions = [
    { label: 'Semua Status', value: '' },
    { label: 'Berhasil', value: 'PAID' },
    { label: 'Menunggu', value: 'PENDING' },
    { label: 'Gagal', value: 'FAILED' },
    { label: 'Kedaluwarsa', value: 'EXPIRED' },
    { label: 'Dikembalikan', value: 'REFUNDED' },
  ];

  const methodOptions = [
    { label: 'Semua Metode', value: '' },
    { label: 'Midtrans', value: 'MIDTRANS' },
    { label: 'Bayar di Tempat', value: 'COD' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Pembayaran</h1>
          <p className="text-[15px] text-[#737686]">
            Pantau semua transaksi pembayaran pelanggan.
          </p>
        </div>

        <FilterBar
          filters={[
            {
              key: 'status',
              options: statusOptions,
              value: status,
              onChange: (val) => {
                setStatus(val as PaymentStatus | '');
                setPage(1);
              },
            },
            {
              key: 'method',
              options: methodOptions,
              value: method,
              onChange: (val) => {
                setMethod(val as PaymentMethod | '');
                setPage(1);
              },
            },
          ]}
          visibleFilters={2}
        />

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
                  <th className="pb-2 pr-2 text-left">ID Transaksi</th>
                  <th className="pb-2 pr-2 text-left">No. Order</th>
                  <th className="pb-2 pr-2 text-left">Pembeli</th>
                  <th className="pb-2 pr-2 text-left">Jumlah</th>
                  <th className="pb-2 pr-2 text-left">Metode</th>
                  <th className="pb-2 pr-2 text-left">Status</th>
                  <th className="pb-2 text-left">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                <PaymentTable
                  payments={items}
                  isLoading={isLoading}
                  emptyMessage={
                    status || method
                      ? 'Nggak ada transaksi yang cocok sama filter ini.'
                      : 'Belum ada transaksi pembayaran.'
                  }
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

export default PaymentsPage;
