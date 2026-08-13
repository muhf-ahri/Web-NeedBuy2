// src/pages/admin/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import { getDashboard, type AdminDashboard } from '../../api/admin';
import { formatRupiah } from '../../utils/currency';

const MONTH_LABEL = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Status order berasal dari enum backend, jadi kuncinya enum itu — bukan label
// tampilan yang gampang bergeser.
const STATUS_STYLE: Record<string, string> = {
  COMPLETED: 'bg-[#d7f5dc] text-[#156b32]',
  DELIVERED: 'bg-[#d7f5dc] text-[#156b32]',
  PROCESSING: 'bg-[#cfe8ff] text-[#0057b8]',
  SHIPPED: 'bg-[#cfe8ff] text-[#0057b8]',
  WAITING_PAYMENT: 'bg-[#fff4e0] text-[#b45309]',
  CANCELLED: 'bg-[#ffe0e0] text-[#a33131]',
};

const STATUS_LABEL: Record<string, string> = {
  COMPLETED: 'Selesai',
  DELIVERED: 'Terkirim',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  WAITING_PAYMENT: 'Menunggu Bayar',
  CANCELLED: 'Dibatalkan',
};

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getDashboard()
      .then((res) => {
        if (alive) setData(res.data.data);
      })
      .catch((err: Error) => {
        if (alive) setError(err.message);
      })
      .finally(() => {
        if (alive) setIsLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-[#737686]">Memuat data…</div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-[#ffcdd2] bg-[#fff5f5] p-6 text-center text-[#a33131]">
          {error ?? 'Data dashboard nggak bisa dimuat.'}
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      // Pendapatan aplikasi = komisi, bukan omzet toko. Omzetnya ikut
      // ditampilkan di hint supaya angkanya bisa ditelusuri.
      title: 'Total Pendapatan',
      value: formatRupiah(data.revenue.platform),
      hint: `Komisi ${data.revenue.commissionPercent}% dari omzet ${formatRupiah(data.revenue.gmv)}`,
      icon: 'payments' as const,
      alert: false,
    },
    {
      title: 'Total Order',
      value: data.orders.total.toLocaleString('id-ID'),
      hint: `${data.needs.completed.toLocaleString('id-ID')} kebutuhan selesai`,
      icon: 'orders' as const,
      alert: false,
    },
    {
      title: 'Toko Aktif',
      value: data.sellers.active.toLocaleString('id-ID'),
      hint: `${data.sellers.suspended.toLocaleString('id-ID')} dibekukan`,
      icon: 'store' as const,
      alert: false,
    },
    {
      // Skema belum punya alur approval terpisah, jadi angkanya diambil dari
      // listing yang belum aktif — data nyata, bukan hitungan karangan.
      title: 'Pending Approvals',
      value: data.products.inactive.toLocaleString('id-ID'),
      hint: data.products.inactive > 0 ? 'Perlu ditinjau' : 'Semua listing aktif',
      icon: 'pending' as const,
      alert: data.products.inactive > 0,
    },
  ];

  const maxRevenue = Math.max(...data.revenueSeries.map((point) => point.revenue), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Admin Central</h1>
          <p className="text-[15px] text-[#737686]">Ringkasan marketplace hari ini.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="rounded-2xl border border-[#e0e3e5] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-2xl font-bold leading-tight text-[#191c1e]">{stat.value}</p>
                  <p className={`mt-1 text-[12px] font-medium ${stat.alert ? 'text-[#ba1a1a]' : 'text-[#737686]'}`}>
                    {stat.hint}
                  </p>
                </div>
                <div className={`shrink-0 rounded-full bg-[#dbe1ff] p-2.5 ${stat.alert ? 'text-[#ba1a1a]' : 'text-[#004ac6]'}`}>
                  <Icon name={stat.icon} size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue & Top Categories */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5 lg:col-span-2">
            <h2 className="text-[15px] font-bold text-[#191c1e]">
              Pendapatan Platform 7 Bulan Terakhir
            </h2>
            <p className="text-[12px] text-[#737686]">
              Komisi {data.revenue.commissionPercent}% dari order yang dibayar.
            </p>
            <div className="mt-4 h-48">
              {data.revenueSeries.length === 0 ? (
                <div className="flex h-full items-center justify-center text-[13px] text-[#737686]">
                  Belum ada order yang dibayar.
                </div>
              ) : (
                <div className="flex h-full items-end justify-between gap-2">
                  {data.revenueSeries.map((point) => {
                    const height = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
                    const month = MONTH_LABEL[Number(point.month.slice(5, 7)) - 1];
                    return (
                      <div key={point.month} className="flex flex-1 flex-col items-center">
                        <div
                          title={`Komisi ${formatRupiah(point.revenue)} — omzet ${formatRupiah(point.gmv)}`}
                          className="w-full rounded-t bg-[#004ac6] transition-all duration-300 hover:bg-[#003ea8]"
                          style={{ height: `${height}%`, minHeight: '8px' }}
                        />
                        <span className="mt-2 text-[10px] text-[#737686]">{month}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#191c1e]">Kategori Teratas</h2>
            <div className="mt-4 space-y-3">
              {data.topCategories.length === 0 ? (
                <p className="text-[13px] text-[#737686]">Belum ada penjualan.</p>
              ) : (
                data.topCategories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#434655]">{cat.name}</span>
                      <span className="font-semibold text-[#191c1e]">{cat.percentage}%</span>
                    </div>
                    <div className="mt-0.5 h-1.5 w-full rounded-full bg-[#f2f4f6]">
                      <div className="h-1.5 rounded-full bg-[#004ac6]" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <h2 className="text-[15px] font-bold text-[#191c1e]">Order Terbaru</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-left text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2">No. Order</th>
                  <th className="pb-2 pr-2">Pembeli</th>
                  <th className="pb-2 pr-2">Toko</th>
                  <th className="pb-2 pr-2">Nilai</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {data.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-[#737686]">
                      Belum ada order.
                    </td>
                  </tr>
                ) : (
                  data.recentOrders.map((order) => (
                    <tr key={order.id} className="text-[13px]">
                      <td className="py-2.5 pr-2 font-medium text-[#004ac6]">{order.orderNumber}</td>
                      <td className="py-2.5 pr-2">{order.customer}</td>
                      <td className="py-2.5 pr-2">{order.store}</td>
                      <td className="py-2.5 pr-2 font-semibold">{formatRupiah(order.amount)}</td>
                      <td className="py-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            STATUS_STYLE[order.status] ?? 'bg-[#f2f4f6] text-[#737686]'
                          }`}
                        >
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals & Withdrawal Requests */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#191c1e]">Pending Approvals</h2>
              {data.pendingProducts.total > 0 && (
                <span className="rounded-full bg-[#ba1a1a] px-2 py-0.5 text-[11px] font-semibold text-white">
                  {data.pendingProducts.total} Baru
                </span>
              )}
            </div>
            <div className="mt-3 space-y-3">
              {data.pendingProducts.items.length === 0 ? (
                <p className="text-[13px] text-[#737686]">Semua listing sudah aktif.</p>
              ) : (
                data.pendingProducts.items.map((product) => (
                  <div key={product.id} className="rounded-xl border border-[#e0e3e5] p-3">
                    <p className="text-[13px] font-semibold text-[#191c1e]">{product.name}</p>
                    <p className="text-[12px] text-[#737686]">{product.store}</p>
                  </div>
                ))
              )}
              <Link
                to="/admin/products"
                className="inline-block pt-1 text-[13px] font-semibold text-[#004ac6] hover:underline"
              >
                Lihat Semua Approval →
              </Link>
            </div>
          </div>

          {/* Penarikan saldo belum ada di skema (WalletTxType: TOPUP/PAYMENT/
              REFUND saja). Card-nya tetap ada supaya layout FE utuh, tapi
              dibiarkan kosong — lebih baik kosong daripada angka karangan.
              ponytail: isi dari GET /admin/withdrawals begitu WalletTxType
              punya WITHDRAW dan endpoint-nya jadi. */}
          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#191c1e]">Withdrawal Requests</h2>
            <div className="mt-3 rounded-xl border border-dashed border-[#c3c6d7] p-6 text-center">
              <p className="text-[13px] text-[#737686]">
                Belum ada permintaan penarikan. Fitur penarikan saldo penjual masih dalam
                pengembangan.
              </p>
              <Link
                to="/admin/withdrawals"
                className="mt-2 inline-block text-[13px] font-semibold text-[#004ac6] hover:underline"
              >
                Buka halaman Withdrawals →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
